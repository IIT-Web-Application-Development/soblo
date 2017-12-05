var BlogPosts = {
	blogPosts: [],
	addEntry: function(blog) {
		try {

			if (blog instanceof BlogPost ) {
				this.blogPosts.push(blog);
		
			} else
				throw "Not a user object!";
			
		} catch(err) {
			console.error(err);
		}
	},
	nextBlogId: function() {
		var nextBlogId = 0; // Start at 0; it will always return 1 or greater.

		for (var i = 0; i < this.blogPosts.length; i++) {
			var thisId = this.blogPosts[i].id;

			// If a higher ID is found, set as the new value.
			if (thisId > nextBlogId)
				nextBlogId = thisId;
		}

		// Return the highest value plus 1.
		return ++nextBlogId;
	},
	getAllEntries: function() {
		return this.blogPosts;
	},
	getComments: function(userName) {
		for (var i = 0; i < this.blogPosts.length; i++) {
			var thisBlog = this.blogPosts[i];

			if (thisBlog.userid == userName) {
				
				return thisBlog.comments;
			}
		}
	},
	getRatings: function(userName) {
		for (var i = 0; i < this.blogPosts.length; i++) {
			var thisBlog = this.blogPosts[i];

			if (thisBlog.userid == userName) {
				
				return thisBlog.ratings;
			}
		}
	}

}

function BlogPost() {
	this.id = 0; 
	this.post = "";
	this.title = ""
	this.userid = "";
	this.comments = [];
	this.ratings = [];
	
	return this;
}

module.exports = {
	BlogPost: function() {
		return new BlogPost();
	},
	BlogPosts: BlogPosts
}
