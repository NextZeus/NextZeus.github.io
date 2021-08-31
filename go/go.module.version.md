# Go Module Version

- Every required module in a go.mod has a semantic version
- A semantic version has the form vMAJOR.MINOR.PATCH.
  - Increment the MAJOR version when you make a **backwards incompatible(向后不兼容)** change to the public API of your module. This should only be done when absolutely necessary(只有在绝对必要的情况下才应该这样做).
  - Increment the MINOR version when you make a **backwards incompatible(向后不兼容)** change to the API, like changing dependencies or adding a new function, method, struct field, or type(更改依赖项或添加新函数、方法、结构字段或类型).
  - Increment the PATCH version after making minor changes that don't affect your module's public API or dependencies, like fixing a bug(修复一个 bug)
- You can specify pre-release versions by appending a hyphen and dot separated identifiers (for example, v1.0.1-alpha or v2.2.2-beta.2) 您可以通过附加连字符和点分隔的标识符(例如，v1.0.1-alpha 或 v2.2.2-beta.2)来指定预发布版本
  - example.com/hello@v1.0.1-alpha
- **v0 major versions** and **pre-release versions** **do not guarantee backwards compatibility(不保证向后兼容)**. They let you refine your API before making stability commitments to your users. However, v1 major versions and beyond require backwards compatibility within that major version.

  - V0 主版本和预发布版本不能保证向后兼容。它们允许您在向用户做出稳定性承诺之前优化 API。但是，v1 主要版本及以上版本需要在该主要版本中保持向后兼容性。

- pseudo-version(伪版本 预发布版本的一种特殊类型) ex: v0.0.0-20170915032832-14c0d48ead0c
- 请求一个新版本的模块 go get-u 或者 go get example.com/hello ,go 命令会选择可用的最好的语义发布版本
- 不要删除版本标签从您的回购。如果发现某个版本有 bug 或安全问题，请发布新版本。如果用户依赖于您已经删除的版本，那么他们的构建可能会失败。
- 同样，一旦发布了一个版本，不要更改或覆盖它。

## V0 最初的，不稳定的版本

- V0 版本不能保证任何稳定性，所以几乎所有的项目都应该从 v0 开始，因为它们要优化它们的公共 API。
- 给一个新版本加标签有几个步骤:
  - 运行 go mod tidy，它删除模块可能累积的不再需要的任何依赖项。
  - 运行 go 测试。/... 最后一次确保一切正常。
  - 使用 git 标签为项目标记一个新版本。git tag -a v0.1.0 -m "my version 0.1.0" ; git push origin v0.1.0
  - 将新标记推送到原始存储库。
- go list-m example.com/hello@v0.1.0 来确认最新版本可用

## V1 第一个稳定版本
- 一旦您完全确定您的模块的 API 是稳定的，您就可以发布 v1.0.0。V1主要版本通知用户，不会对模块的 API 进行不兼容的更改
