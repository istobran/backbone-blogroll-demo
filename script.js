// Backbone Model
var Blog = Backbone.Model.extend({
  defaults: {
    author: "",
    title: "",
    url: ""
  }
})


// Backbone Collection
var Blogs = Backbone.Collection.extend({});

// Backbone View
var InputView = Backbone.View.extend({
  template: _.template($("#tpl-input").html(), {variable: 'info'})
});

// Backbone View for one blog
var BlogView = Backbone.View.extend({
  model: new Blog(),
  tagName: "tr",
  template: _.template($("#tpl-blog").html()),
  editing: false,
  events: {
    "click .edit-blog": "edit",
    "click .update-blog": "update",
    "click .delete-blog": "delete",
    "click .cancel": "cancel"
  },
  toggleEdit: function(action) {
    this.$(".edit-blog").toggle();
    this.$(".delete-blog").toggle();
    this.$(".update-blog").toggle();
    this.$(".cancel").toggle();
    if (this.editing === false) {
      var author = this.$(".author").text();
      var title = this.$(".title").text();
      var url = this.$(".url").text();
      this.$(".author").html(new InputView().template({class: "author", value: author}));
      this.$(".title").html(new InputView().template({class: "title", value: title}));
      this.$(".url").html(new InputView().template({class: "url", value: url}));
      this.editing = true;
    } else {
      if (action == "update") {
        var author = this.$(".author-update").val();
        var title = this.$(".title-update").val();
        var url = this.$(".url-update").val();
        this.$(".author").html(author);
        this.$(".title").html(title);
        this.$(".url").html(url);
      } else if (action == "cancel") {
        this.$(".author").html(this.model.get("author"));
        this.$(".title").html(this.model.get("title"));
        this.$(".url").html(this.model.get("url"));
      }
      this.editing = false;
    }
  },
  edit: function() {
    this.toggleEdit("edit");
  },
  update: function() {
    this.model.set("author", $(".author-update").val());
    this.model.set("title", $(".title-update").val());
    this.model.set("url", $(".url-update").val());
    this.toggleEdit("update");
  },
  delete: function() {
    this.model.destroy();
  },
  cancel: function() {
    this.toggleEdit("cancel");
  },
  render: function() {
    this.$el.html(this.template(this.model.toJSON()));
    return this;
  }
});

// Backbone View for blog list
var BlogsView = Backbone.View.extend({
  model: new Blogs(),
  el: $(".blog-list"),
  initialize: function() {
    this.model.on("add", this.render, this);
    this.model.on("remove", this.render, this);
  },
  render: function() {
    this.$el.html("");
    _.each(this.model.toArray(), function(item) {
      this.$el.append(new BlogView({model: item}).render().$el);
    }, this);
  }
});

$(function() {
  var blogsView = new BlogsView();
  $(".add-blog").click(function() {
    var blog = new Blog({
      author: $(".author-input").val(),
      title: $(".title-input").val(),
      url: $(".url-input").val()
    });
    $(".author-input").val("");
    $(".title-input").val("");
    $(".url-input").val("");
    blogsView.model.add(blog);
  });
})
