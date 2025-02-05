package test_utils

import (
	"context"
	"fmt"
	"github.com/go-logr/logr"
	admissionv1 "k8s.io/api/admissionregistration/v1"
	metav1 "k8s.io/apimachinery/pkg/apis/meta/v1"
	"k8s.io/apimachinery/pkg/runtime/schema"
	"net/http"
	"sigs.k8s.io/controller-runtime/pkg/log"
	"sigs.k8s.io/controller-runtime/pkg/webhook"
	"sigs.k8s.io/controller-runtime/pkg/webhook/admission"
)

type CallbackHandler func(request admission.Request)
type CallbackHandlerEntry struct {
	GVR      schema.GroupVersionResource
	Callback CallbackHandler
}

func (k *EnvTestCluster) buildServeCallback(gvr schema.GroupVersionResource, cb CallbackHandler) http.Handler {
	wh := &webhook.Admission{
		Handler: admission.HandlerFunc(func(ctx context.Context, request admission.Request) admission.Response {
			k.serveCallback(gvr, request, cb)
			return admission.Allowed("")
		}),
	}
	wh.LogConstructor = func(base logr.Logger, req *admission.Request) logr.Logger {
		return logr.New(log.NullLogSink{})
	}
	return wh
}

func (k *EnvTestCluster) serveCallback(gvr schema.GroupVersionResource, request admission.Request, cb CallbackHandler) {
	if request.Resource.Group != gvr.Group || request.Resource.Version != gvr.Version || request.Resource.Resource != gvr.Resource {
		return
	}

	cb(request)
}

func (k *EnvTestCluster) startCallbackServer() error {
	k.callbackServer.Host = k.env.WebhookInstallOptions.LocalServingHost
	k.callbackServer.Port = k.env.WebhookInstallOptions.LocalServingPort
	k.callbackServer.CertDir = k.env.WebhookInstallOptions.LocalServingCertDir

	ctx, cancel := context.WithCancel(context.Background())
	k.callbackServerStop = cancel

	go func() {
		_ = k.callbackServer.Start(ctx)
	}()

	return nil
}

func (k *EnvTestCluster) InitWebhookCallback(gvr schema.GroupVersionResource, isNamespaced bool) {
	scope := admissionv1.ClusterScope
	if isNamespaced {
		scope = admissionv1.NamespacedScope
	}

	failedTypeV1 := admissionv1.Fail
	equivalentTypeV1 := admissionv1.Equivalent
	noSideEffectsV1 := admissionv1.SideEffectClassNone
	timeout := int32(30)

	group := gvr.Group
	if gvr.Group == "" {
		group = "none"
	}
	name := fmt.Sprintf("%s-%s-%s-callback", group, gvr.Version, gvr.Resource)
	path := "/" + name

	k.env.WebhookInstallOptions.ValidatingWebhooks = append(k.env.WebhookInstallOptions.ValidatingWebhooks, &admissionv1.ValidatingWebhookConfiguration{
		ObjectMeta: metav1.ObjectMeta{
			Name: name,
		},
		TypeMeta: metav1.TypeMeta{
			Kind:       "ValidatingWebhookConfiguration",
			APIVersion: "admissionregistration.k8s.io/v1",
		},
		Webhooks: []admissionv1.ValidatingWebhook{
			{
				Name: fmt.Sprintf("%s.callback.kubectl.io", name),
				Rules: []admissionv1.RuleWithOperations{
					{
						Operations: []admissionv1.OperationType{"CREATE", "UPDATE"},
						Rule: admissionv1.Rule{
							APIGroups:   []string{gvr.Group},
							APIVersions: []string{gvr.Version},
							Resources:   []string{gvr.Resource},
							Scope:       &scope,
						},
					},
				},
				FailurePolicy: &failedTypeV1,
				MatchPolicy:   &equivalentTypeV1,
				SideEffects:   &noSideEffectsV1,
				ClientConfig: admissionv1.WebhookClientConfig{
					Service: &admissionv1.ServiceReference{
						Path: &name,
					},
				},
				AdmissionReviewVersions: []string{"v1"},
				TimeoutSeconds:          &timeout,
			},
		},
	})

	k.callbackServer.Register(path, k.buildServeCallback(gvr, k.handleWebhook))
}

func (k *EnvTestCluster) handleWebhook(request admission.Request) {
	k.webhookHandlersMutex.Lock()
	defer k.webhookHandlersMutex.Unlock()

	for _, e := range k.webhookHandlers {
		if e.GVR.Group == request.Resource.Group && e.GVR.Version == request.Resource.Version && e.GVR.Resource == request.Resource.Resource {
			e.Callback(request)
		}
	}
}

func (k *EnvTestCluster) AddWebhookHandler(gvr schema.GroupVersionResource, cb CallbackHandler) *CallbackHandlerEntry {
	k.webhookHandlersMutex.Lock()
	defer k.webhookHandlersMutex.Unlock()

	entry := &CallbackHandlerEntry{
		GVR:      gvr,
		Callback: cb,
	}
	k.webhookHandlers = append(k.webhookHandlers, entry)

	return entry
}

func (k *EnvTestCluster) RemoveWebhookHandler(e *CallbackHandlerEntry) {
	k.webhookHandlersMutex.Lock()
	defer k.webhookHandlersMutex.Unlock()
	old := k.webhookHandlers
	k.webhookHandlers = make([]*CallbackHandlerEntry, 0, len(k.webhookHandlers))
	for _, e2 := range old {
		if e != e2 {
			k.webhookHandlers = append(k.webhookHandlers, e2)
		}
	}
}
