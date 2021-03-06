const normalizeUrl = require("normalize-url")
const yeoman = require("yeoman-generator")
const clor = require("clor")
const yo = require("yosay")

module.exports = yeoman.generators.Base.extend({
  init: function () {
    const done = this.async()

    this.log(yo("Welcome to the " + clor.cyan("Fly Plugin Generator")))

    this.prompt([
      {
        name: "githubUserName",
        message: "What is your GitHub user name?",
        store: true,
        validate: function (value) {
          return value.length > 0 ? true : "github needed"
        }
      },
      {
        name: "website",
        message: "What is your website URL",
        store: true,
        default: function (props) {
          return "http://github.com/" + props.githubUserName
        }
      },
      {
        name: "pluginName",
        message: "What is your plugin name?",
        default: require("path").basename(process.cwd())
      },
      {
        name: "description",
        message: "Add plugin description",
        default: function (props) {
          return properCase(getSlugName(props.pluginName)) + " plugin for Fly."
        }
      },
      {
        type: "confirm",
        name: "changelog",
        message: "Do you need a CHANGELOG file?",
        store: true,
        default: true
      }],
      function (props) {
        this.props = props
        this.pluginName = this.props.pluginName
        this.pluginSlugName = getSlugName(props.pluginName)
        this.pluginTitleName = properCase(this.pluginSlugName)
        this.description = this.props.description
        this.githubUserName = this.props.githubUserName
        this.name = this.user.git.name()
        this.email = this.user.git.email()
        this.website = normalizeUrl(this.props.website)

        this.directory("test")
        this.template("_travis.yml", ".travis.yml")
        this.template("eslintrc", ".eslintrc")
        this.template("editorconfig", ".editorconfig")
        this.template("index.js")
        this.template("README.md")
        this.template("LICENSE")
        this.template("_package.json", "package.json")
        this.template("gitignore", ".gitignore")

        if (this.props.changelog) this.template("CHANGELOG.md")

        done()
    }.bind(this))
  },

  install: function () {
    this.installDependencies({ bower: false })
  }
})

function getSlugName (pluginName) {
  return pluginName.split("-").pop()
}

function properCase (word) {
  return word.charAt(0).toUpperCase() + word.slice(1)
}
