$( document ).ready(function() {
	
	$('#search').on('submit', function (e) {
		$('#search').css({"display":"none"}).after('<img src="http://www.statistics.gov.my/censusatlas/images/loading_1.gif" id="loading_gif">');
		$('.error').remove();
	    e.preventDefault();
	    searchWiki($('#search input[type=search]').val());
	});
	

})
/*
	function submitForm(e){
		console.log("submitForm()");
		$('#search').css({"display":"none"}).after('<img src="http://www.statistics.gov.my/censusatlas/images/loading_1.gif" id="loading_gif">');
		$('.error').remove();
	    searchWiki($('#search input[type=search]').val());
	    return false;
	}
*/
function searchWiki(search){
	console.log("in search wiki");
	$( '#search-con').addClass('search-con').removeClass('search-con_nosearch');
	
	var processedSearch = search.trim().replace(/ /g,"_");
	
	var wikiUrl = "https://en.wikipedia.org/w/api.php?format=json&action=query&generator=search&gsrnamespace=0&gsrsearch="+ processedSearch + "&gsrlimit=10&prop=pageimages|extracts&pilimit=max&pithumbsize=300&exintro&explaintext&exsentences=2&exlimit=max";
console.log(wikiUrl);
	 $.ajax({
	    dataType: "jsonp",
	    url: wikiUrl,
	    success: getWikiContent,
	    error: function(){
		    	console.log("failure of getJSON api");
		    }
	  });
}


function getWikiContent(data){
	console.log("------getWIkiContent()------");

	$('#content-con_inner').html('');
	// need to check if "pages" exists first
	if(data["query"] !== undefined){
		for(var pageId in data["query"]["pages"]){
			
			var wikiResult = {};
			console.log("------------ pageId: " + pageId + "-------------");
			wikiResult.title = data["query"]["pages"][pageId]["title"];
		
			wikiResult.url ="https://en.wikipedia.org/wiki/" + data["query"]["pages"][pageId]["title"].trim().replace(/ /g,"_");
		
			wikiResult.extract = data["query"]["pages"][pageId]["extract"];

			if(data["query"]["pages"][pageId].hasOwnProperty('thumbnail')){
			
				wikiResult.thumbnail = data["query"]["pages"][pageId]["thumbnail"]["source"];

			}

			console.log("---- WikiResult is:  ------");
			console.log (JSON.stringify(wikiResult,null,1));
			wikiDisplay(wikiResult);

		}
	}else{//data["query"]["pages"] does not exist

		console.log("pages don't exist");
		noContentDisplay();
		return;
	}

	contentDisplay();
} // end of getWIkiContent

function wikiDisplay(info){

	if(info.hasOwnProperty("thumbnail")){
	 var content = '<div class="wiki-result_con">' +
						'<div class="left-column">'+
							'<div class="wiki-result_thumbnail">' + 
								'<img src="' + info.thumbnail + '" class="wiki-img" />' +
							'</div>' +
						'</div>'  + 
						'<div class="right-column">' +
							'<div class="inner">' +
								'<div class="wiki-result_title">' +
									'<a href="'+info.url+'">' + info.title + '</a>' +
								'</div>' +
								'<div class="wiki-result_extract">' +
									info.extract +
								'</div>' +
							'<div>' +
						'</div>' +
					'</div>';				
	}else{
	 var content = '<div class="wiki-result_con">' +
						'<div class="inner">' +
							'<div class="right-column" style="width:100%">' +
								'<div class="wiki-result_title">' +
									'<a href="'+info.url+'">' + info.title + '</a>' +
								'</div>' +
								'<div class="wiki-result_extract">' +
									info.extract +
								'</div>' +
							'</div>' +
						'</div>' +
					'</div>';
	}
	//output content
	$( '#content-con_inner' ).append(content);
}// end of wikiDisplay

function noContentDisplay(){
	$('#loading_gif').remove();
	$('#search').css({"display":"block"});
	$('#search').after('<div class="error"> No Results! </div>');
	$('#content-con').css({"display":"none"});
}
function contentDisplay(){
	$('#loading_gif').remove();
	$('#search').css({"display":"block"});
	$('#content-con').css({"display":"block"});
}