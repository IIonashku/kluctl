package main

import (
	git_url "github.com/kluctl/kluctl/v2/pkg/git/git-url"
	"github.com/kluctl/kluctl/v2/pkg/types"
	"github.com/kluctl/kluctl/v2/pkg/types/result"
	"github.com/kluctl/kluctl/v2/pkg/utils/uo"
	"github.com/kluctl/kluctl/v2/pkg/webui"
	"github.com/tkrajina/typescriptify-golang-structs/typescriptify"
)

func main() {
	converter := typescriptify.New().
		WithBackupDir("").
		Add(result.CommandResult{}).
		Add(result.ProjectSummary{}).
		Add(result.CommandResultSummary{}).
		Add(webui.ShortName{}).
		Add(uo.UnstructuredObject{}).
		ManageType(git_url.GitUrl{}, typescriptify.TypeOptions{TSType: "string"}).
		ManageType(types.YamlUrl{}, typescriptify.TypeOptions{TSType: "string"}).
		ManageType(types.JsonTime(""), typescriptify.TypeOptions{TSType: "string"}).
		ManageType(uo.UnstructuredObject{}, typescriptify.TypeOptions{TSType: "any"})

	err := converter.ConvertToFile("ui/src/models.ts")
	if err != nil {
		panic(err.Error())
	}
}
