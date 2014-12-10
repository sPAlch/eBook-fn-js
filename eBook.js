$(function(){

	var windowW = $(window).width();
	var windowH = $(window).height();
	
	var photoData = [];
	var configUrl = "config.txt";

	var imgFileName;
	var imgFileType;
	var imgPath;
	var imgTotal;
	var imgCat;
	var imgIndex = [];
	var catPic;

	var imgLoadedVal = 0;
	
	var $imgContainer = $("#img-container");
	var $imgContainerImg;

	var $eBook = $("#eBook");
	var $bookAlbum = $("#book-album");
	var $bookAlbumBG = $("#book-album .album-bg");
	var $albumPage = $("#book-album .album-page");
	var $albumImg;
	var albumTotalPage;
	var albumCurrentPage;
	
	var $loadingPage = $("#loading-page");
	var $loadingStatus = $("#loading-page .loading-status");
	var $loadingCircle = $("#loading-page .loading-circle .arc");
	var loadingOffset = $loadingCircle.attr("stroke-dashoffset");
	
	var currentCat = 0;
	var currentPage;
	var $bookPage = $("#book-page");
	var $bookPage = $("#book-page");
	var $bookToolBar = $("#eBook .tool-bar");

	var $pageCurrent = $("#book-page .current-page");
	var $pageNext = $("#book-page .next-page");
	var $pageTitle = $("#eBook .page-title .p-title");
	var $pageDate = $("#eBook .page-title .p-date");
	
	var $bookCat = $( "#book-cat" );
	var $bookCatBg = $( "#book-cat .cat-bg" );
	var $bookCatList = $( "#book-cat .cat-list" );
	
	var $bookIndex = $( "#book-index" );
	var $bookIndexList = $( "#book-index ul" );
	var indexVal = -1;

	var $catTitle = $( "#cat-title" );
	var $mainToolBar = $( "#main-tool-bar" );

	var isAnimated = false;

	var sImgW = 134;
	var sImgH = 116;
	var sPadding = 8;
	var sMarginL = 4;
	var sMarginT = 8;

	var mImgW = 240;
	var mImgH = 240;
	var mMarginL = 10;

	var ctrlH = 96;
	

	var isTouchDevice = false;

	var $bgAnimate = $(".bg-animate");

	$("#book-page").css( "height", windowH );
	$mainToolBar.css( "left", (windowW - $mainToolBar.width())/2 );
	

	function loadConfigData(){

		$.ajax({

			type: "GET",
			url: configUrl, 
			dataType: "json",
			cache:false,
			success: function(JData){

				console.log(JData);
				photoData　=　JData.photoData;
			
				setImgCat();
				showCat();

			},
			error: function(error) {

				console.log(error);
			}

		});

	}

	$(".btn-cat").click(function(){

		if( !$(this).hasClass( "btn-selected" ) ){
		
			showCat();

		}

	});

	$(".btn-album").click(function(){

		if( !$(this).hasClass( "btn-selected" ) ){
		
			showAlbum();

		}else{

			closeAlbum();
		}
	
	});

	$(".btn-index").click(function(){

		if( !$(this).hasClass( "btn-selected" ) ){
		
			showIndex();

		}else{

			closeIndex();
		}
	
	});


	$(".btn-next").click(function(){

			showPage( currentPage + 1 )

	});

	$(".btn-prev").click(function(){

			showPage( currentPage - 1 )

	});

	function setImgCat(){
	
		var $catList = $bookCatList.find( "ul" );
	
		for( var i = 0; i < photoData.length; i++ ){
		
			var $singleCat = $("<li></li>");
			var catPic = photoData[i].catPic;
			var catName = photoData[i].imgCat;
			
			$singleCat.data({
			
				"catIndex" : i
			
			}).text(catName).css({
			
				"background-image" : "url(" + catPic + ")"
			
			}).click(function(){
			
				var catIndex = $(this).data( "catIndex" );

				$(".btn-cat").removeClass( "btn-selected" );

				$(".bg-animate").hide();

				$bookCatBg.fadeOut(function(){
			
					$bookCat.hide();
						
					if( currentCat != catIndex ){
						
						currentCat = catIndex;
						setImgData(currentCat);
							
					}
			
				});
			
			}).appendTo( $catList );
		
		}
	
	}

	function blurBook( blurVal, $blurElement ){

		$blurElement.css({

				"filter" : "blur(" + blurVal + "px)",
				"-webkit-filter" : "blur(" + blurVal + "px)",
				"-o-filter" : "blur(" + blurVal + "px)",
				"-ms-filter" : "blur(" + blurVal + "px)"

		} );

	}

	function setImgData(catVal){
	
		imgFileName = photoData[catVal].imgFileName;
		imgFileType = photoData[catVal].imgFileType;
		imgPath = photoData[catVal].imgPath;
		imgTotal = photoData[catVal].imgTotal;
		imgCat = photoData[catVal].imgCat
		imgIndex = photoData[catVal].imgIndex;
		catPic = photoData[catVal].catPic;

		$(".cat-list li").removeClass( "cat-selected" );
		$(".cat-list li").eq(catVal).addClass( "cat-selected" );

		clearElement();

		$("h2").text( imgCat ).css({
		 		"background-image" : "url(" + catPic + ")"
		 });

		$mainToolBar.hide();
		$catTitle.css({

			top : windowH/2 - $catTitle.height()

		}).fadeIn();

		$loadingPage.fadeIn(function(){

			setImgContainer();
			loadingStatusCheck();
		
		});

	}

	function clearElement(){
	
		$imgContainer.html("");
		$pageCurrent.html("");
		$pageNext.html("");
		$albumPage.html("").show();

		$bookIndex.hide();
		$bookIndexList.html("");
		$bookAlbum.hide().find("ul").remove();

		$pageTitle.text("");

		$loadingStatus.text("0%");
		$loadingCircle.attr( "stroke-dashoffset" , loadingOffset );

		imgLoadedVal = 0;
		currentPage = false;
		indexVal = -1;

	}

	function setImgContainer(){
	
		var imgUrl = imgPath + "/" + imgFileName + "-";
		
		for( var i = 1; i <= imgTotal; i++){
		
			var singleImgUrl = imgUrl + i + ".jpg";
			var singleImgData;

			var $singleImg = $("<img/>").attr( "src" , singleImgUrl ).appendTo( $imgContainer );
			
			for( var j = 0; j < imgIndex.length; j++ ){
			
				var startP = imgIndex[j].startP;
				var endP = imgIndex[j].endP;

				
				if( i >= startP && i <= endP ){

					$singleImg.data({
					
						"title" : imgIndex[j].title, 
						"date" : imgIndex[j].date,
						"indexVal" : j,
						"pageNum" : i
					
					});

				}
			
			}
			
			
			(function ($singleImg){
				
				setTimeout( function(){

					singleImgLoad( $singleImg, true );

				} , 50*i );
				
			})( $singleImg );

		}
	
	}
	
	function singleImgLoad( $singleImg, getColor ){


		var image = new Image();

		image.src = $singleImg.attr("src");

		image.onload = function() {

			if( getColor ){

				var paletteArray = getImgColor( $singleImg );	

			}


			$singleImg.data({
			
				"imgWidth" : this.width,
				"imgHeight" : this.height,
				"paletteArray" : paletteArray

			});

			imgLoaded( $singleImg );

		};

	}
	
	function imgLoaded( $loadedImg ){
	
		imgLoadedVal++;
		setImgSize( $loadedImg, windowW,  windowH - ctrlH, 0, 0);
		
	}
	
	function loadingStatusCheck(){
	
		var targetOffset = loadingOffset * ( 1 - imgLoadedVal/imgTotal );
		var currentOffset = $loadingCircle.attr( "stroke-dashoffset" );
		
		var deltaOffset = currentOffset - targetOffset;
		var offsetVal;
		
		if( deltaOffset > 0 && deltaOffset/loadingOffset < 0.01 ){
		
			offsetVal = currentOffset -  deltaOffset;
			
		}else{
		
			offsetVal = currentOffset -  deltaOffset*0.075;
		
		}
		
		var loadingPercent = Math.floor( (1 - offsetVal/loadingOffset)*100 );

		$loadingStatus.text( loadingPercent + "%" );
		$loadingCircle.attr( "stroke-dashoffset" , offsetVal );

		if( loadingPercent == 100 ){

			initialSet();
			$catTitle.css({

					"top" : 32

			});
		
		}else{
		
			setTimeout( loadingStatusCheck, 50 );
		
		}
	
	}
	
	function initialSet(){

		$imgContainerImg = $("#img-container img");
		
		for( var i = 0; i < imgTotal; i++ ){
		
			var $singleAlbum = $("<li></li>").appendTo( $bookAlbum );
			var $singleAlbumText = $("<div></div>").addClass("album-text").text( $imgContainerImg.eq(i).data("title") ).appendTo( $singleAlbum );
			
			var $singleAlbumImg = $imgContainerImg.eq(i).clone().data({
			
					"imgWidth" : $imgContainerImg.eq(i).data("imgWidth"),
					"imgHeight" : $imgContainerImg.eq(i).data("imgHeight"),
					"title" : $imgContainerImg.eq(i).data("title"),
					"date" : $imgContainerImg.eq(i).data("date"),
					"pageNum" : $imgContainerImg.eq(i).data("pageNum")

				}).appendTo( $singleAlbum );

			setImgSize( $singleAlbumImg, sImgW, sImgH, sPadding, sPadding);
			
			$singleAlbum.click(function(){

					closeAlbum();
					showPage( $(this).find("img").data( "pageNum" ) );
				
			})

		}
		
		$albumImg = $("#book-album li");

		setIndexPage();
		showPage( 1 );
		adjustAlbum();

		showIndex();
		$mainToolBar.fadeIn();

		$loadingPage.fadeOut();

	}
	
	function showPage( page ){

		if( page > 0 && page <= imgTotal && page != currentPage && !isAnimated){

			isAnimated = true;

			var pageIndex = $imgContainerImg.eq( page-1 ).data( "indexVal" )
		
			$( "#eBook .tool-bar .btn" ).removeClass( "btn-disabled" );
			$albumImg.removeClass( "currentP" );

			if(!currentPage){

				$imgContainerImg.eq( page-1 ).appendTo( $pageCurrent )

				$pageTitle.text( $imgContainerImg.eq( page-1 ).data( "title" ) );
				$pageDate.text( $imgContainerImg.eq( page-1 ).data( "date" ) );

				currentPage = page;
				isAnimated = false;

				checkIndexPage(pageIndex);
				setBookPageColor();

			}else{
			
				var currentLeft;
				var nextLeft;
			
				if( page > currentPage ){
					
					currentLeft = -windowW;
					nextLeft = windowW;
		
				}else if( page < currentPage ){
		
					currentLeft = windowW;
					nextLeft = -windowW;
		
				}

				$imgContainerImg.eq( page-1 ).appendTo( $pageNext );

				$pageCurrent.animate({"left" : currentLeft});
				$pageNext.css("left", nextLeft)
						.animate({"left" : 0},function(){

							$pageTitle.text( $imgContainerImg.eq( page-1 ).data( "title" ) );
							$pageDate.text( $imgContainerImg.eq( page-1 ).data( "date" ) );
					
							$pageCurrent.find( "img" ).appendTo( $imgContainer );

							$pageCurrent.css("left", 0).append( $imgContainerImg.eq( page-1 ) );
							$pageNext.css("left", windowW);
							
							isAnimated = false;

							checkIndexPage(pageIndex);
							setBookPageColor();

						});

			}
			
			currentPage = page;
			$albumImg.eq( currentPage-1 ).addClass( "currentP" );
			
			if( currentPage == 1 ){ $(".btn-prev").addClass( "btn-disabled" ); }
			if( currentPage == imgTotal ){ $(".btn-next").addClass( "btn-disabled" ); }
			
			setAlbumPage();
			
		}

	}
	
	function showAlbum(){
	
		$(".btn-album").addClass( "btn-selected" );

		if( $(".btn-index").hasClass( "btn-selected" ) ){

			$(".btn-index").removeClass( "btn-selected" )
			$bookIndex.hide();

			$bookAlbum.show();

		}else{

			blurBook( 10, $eBook );
			$bookAlbum.fadeIn();
			$catTitle.fadeIn();

		}
			
	}
	
	function closeAlbum(){
	
		$(".btn-album").removeClass( "btn-selected" );

		$catTitle.fadeOut();
		$bookAlbum.fadeOut(function(){ 	blurBook( 0, $eBook ); });
	
	}

	function showIndex(){
	
		$(".btn-index").addClass( "btn-selected" );
			
		if( $(".btn-album").hasClass( "btn-selected" ) ){

			$(".btn-album").removeClass( "btn-selected" )
			$bookAlbum.hide();

			$bookIndex.show();

		}else{

			blurBook( 10, $eBook);
			$bookIndex.stop().fadeIn();
			$catTitle.fadeIn();

		}
	
	}
	
	function closeIndex(){
	
		$(".btn-index").removeClass( "btn-selected" );
		$catTitle.fadeOut();
	
		$bookIndex.stop().fadeOut(function(){ blurBook( 0, $eBook); });
	
	}

	function showCat(){

		$(".btn-cat").addClass( "btn-selected" );
		blurBook( 10, $eBook );

		$bookCat.show();
		$bookCatBg.fadeIn(function(){
			
			$bookCatList.show();
			$(".bg-animate").show();
			
		});
				
	}


	function adjustAlbum(){
		
		var singleW = sImgW + sPadding*2 + sMarginL*2;
		var singleH = sImgW + sPadding*2 + sMarginT*2;

		var winW;
		var winH = windowH - ctrlH - 96;
		
		if( windowW > 1000 ){ 

			winW = 1000;
			
		}else{

			winW = windowW;
		
		}
		
		var leftVal = Math.floor( winW/singleW ) ;
		var topVal = Math.floor( winH/singleH ) ;

		var totalW = leftVal*singleW;
		var totalH = topVal*singleH;
		var onePVal = leftVal*topVal;
		
		if( Math.floor( imgTotal/onePVal )*onePVal < imgTotal ){

			albumTotalPage = Math.floor( imgTotal/onePVal ) + 1;

		}else{

			albumTotalPage = Math.floor( imgTotal/onePVal );

		}
		
		var deltP = albumTotalPage - $("#book-album ul").size();

		if( deltP > 0){

			for( var i = 0;  i < deltP; i++){
				
				$("<ul></ul>").appendTo( $bookAlbum );
				$("<div></div>").addClass("album-btn").click(function(){
				
					var index = $("#book-album .album-page .album-btn").index( this );

					var pageWidth = $("#book-album ul").eq( index ).width();
					var pageMove;
					var pageMoveVal;
					
					if( index != albumCurrentPage ){
					
						$("#book-album .album-page .album-btn").removeClass( "selected" );
					
						if( index > albumCurrentPage ){
					
							pageMove = ( windowW - pageWidth )/2;
							pageMoveVal = -windowW;
						
						}else if( index < albumCurrentPage ){
					
							pageMove = ( windowW - pageWidth )/2;
							pageMoveVal = windowW;
					
						}
					
						$("#book-album ul").eq( albumCurrentPage ).animate({ "left" : pageMove + pageMoveVal });

						$("#book-album ul").eq( index ).css( "left" , pageMove - pageMoveVal ).animate({"left":pageMove},function(){
					
							albumCurrentPage = index;
							$("#book-album .album-page .album-btn").eq(index).addClass( "selected" );
					
						});	
					
					}
				
				}).appendTo( $albumPage );
					
			}
		}
			
		for( var k = 0; k < albumTotalPage; k++ ){

			for( var j = 0; j< onePVal; j++){
				
				var targetImg = k*leftVal*topVal + j;
				var $targetPage = $("#book-album ul").eq(k);
				
				if( targetImg < imgTotal){

					$albumImg.eq( targetImg ).appendTo( $targetPage );

				}
			}

		}

		$("#book-album ul").each(function(){

			if( $(this).find("li").size() < 0 ){
			
				var index = $("#book-album ul").index( this );
				
				$("#book-album .album-page .album-btn").eq(index).remove();
				$(this).remove();
				
			}else{

				$(this).css({

					left : windowW,
					top : ( winH - totalH)/2+96,
					width : totalW,
					height : totalH

				})
				
			}
		})

		setAlbumPage();

	}

	function setAlbumPage(){

		$("#book-album .album-page .album-btn").removeClass( "selected" );

		$("#book-album ul").each(function(){

			var albumPageW = $(this).width();
			var index = $("#book-album ul").index( this );

			if( $(this).find("li.currentP").size() > 0 ){

				$("#book-album .album-page .album-btn").eq(index).addClass( "selected" );
				$(this).css( "left", ( windowW - albumPageW)/2 );

				albumCurrentPage = index;

			}else{

				$(this).css( "left", windowW );
			
			}

		})
	
	}

	function checkIndexPage( checkVal ){

		if( checkVal != indexVal ){

			indexVal = checkVal;
			moveIndexPage( indexVal );

		}

	}
	function setIndexPage(){
	
		if( imgIndex.length > 1 ){
		
			for( var i = 0; i < imgIndex.length; i++ ){
			
				var $singleIndexList = $( "<li></li>" ).appendTo( $bookIndexList );

				var $singleIndexTitle = $( "<div></div>" ).addClass("list-title").text( imgIndex[i].title ).appendTo( $singleIndexList );
				var $singleIndexDate = $( "<div></div>" ).addClass("list-date").text( imgIndex[i].date ).appendTo( $singleIndexList );
				var $singleIndexPic = $( "<div></div>" ).addClass("list-pic").appendTo( $singleIndexList );
				var $singleIndexBG = $("<div></div>").addClass("list-bg").appendTo( $singleIndexPic );

				if( imgIndex[i].indexPic ){

					$("<img/>").attr( "src", imgIndex[i].indexPic ).appendTo( $singleIndexPic );

				}else{
				
					$imgContainerImg.eq( imgIndex[i].startP - 1 ).clone().data({

						"imgWidth" : $imgContainerImg.eq( imgIndex[i].startP - 1 ).data( "imgWidth" ),
						"imgHeight" : $imgContainerImg.eq( imgIndex[i].startP - 1 ).data( "imgHeight" ),
						"paletteArray" : $imgContainerImg.eq( imgIndex[i].startP - 1 ).data( "paletteArray" )

					}).appendTo( $singleIndexPic );
				
				}

				$singleIndexPic.data({

						"title" : imgIndex[i].title,
						"date" : imgIndex[i].date,
						"pageNum" : imgIndex[i].startP,
						"indexVal" : i

					}).click(function(){

						if( !isAnimated ){

							var $prentElement = $(this).parent();
							if( $prentElement.hasClass("index-selected") ){

								closeIndex();

								if( $(this).data( "indexVal" ) != indexVal ){

									showPage( $(this).data( "pageNum" ) )

								}

							}else{

								moveIndexPage( $(this).data( "indexVal" ) );

							}

						}

				})

				var colorArray = $imgContainerImg.eq( imgIndex[i].startP - 1 ).data( "paletteArray" )

				setBGColor( $singleIndexBG, colorArray[0], 1 );
				setImgSize( $singleIndexPic.find("img"), 210, 210, 15, 15 );

				$singleIndexPic.clone().removeClass("list-pic").addClass("list-shadow").appendTo( $singleIndexList );

			}

		}

	}
	
	function moveIndexPage( targetVal ){

		var winH = windowH - ctrlH;
		isAnimated = true;

		$bookIndexList.find("li").each(function(){

			var thisIndex = $(this).find( ".list-pic" ).data( "indexVal" );
			var indexDelta = thisIndex - targetVal;

			$(this).removeClass("index-selected").removeClass("index-left-1").removeClass("index-left-2")
			.removeClass("index-right-1").removeClass("index-right-2");

			switch ( indexDelta ){

				case -2:

					$(this).addClass("index-left-2");
					break;

				case -1:

					$(this).addClass("index-left-1");
					break;

				case 0:

					$(this).addClass("index-selected");
					break;

				case 1:

					$(this).addClass("index-right-1");
					break;

				case 2:

					$(this).addClass("index-right-2");
					break;

			}

		});

		$bookIndexList.css({

			"width" : imgIndex.length * ( mImgW + mMarginL*2 ),
			"height" : mImgH,
			"top" : ( winH - mImgH)/2 + 64

		}).animate({

			"left" : ( windowW - ( mImgW + mMarginL*2 )*(targetVal*2+1) )/2

		},function(){

			isAnimated = false;

		})

	}

	function setImgSize( $img, limtW, limtH, fixX, fixY ){

		var imgW = $img.data( "imgWidth" );
		var imgH = $img.data( "imgHeight" );
		var imgR = imgW/imgH;
		var limitR = limtW/limtH;

		if(imgR > limitR && imgW > limtW){

				imgW = limtW;
				imgH = limtW/imgR;

		}

		if(imgR <= limitR && imgH > limtH){

				imgW = limtH*imgR;
				imgH = limtH;

		}
		
		$img.css({

			width : imgW,
			height : imgH,
			left : (limtW-imgW)/2 + fixX,
			top : (limtH-imgH)/2 + fixY

		});

	}

	function setBookPageColor(){
		
		var colorArray = $imgContainerImg.eq( currentPage-1 ).data( "paletteArray" );

		setBGColor( $bookPage, colorArray[0], 1 );
		setBGColor( $bookToolBar, colorArray[1], 0.5 );
		
	}

	function setBGColor( $targetElement, colorVal, colorAlpha ){

		$targetElement.css({
			"background-color" : "rgba("+colorVal[0]+","+colorVal[1]+","+colorVal[2]+" , " + colorAlpha + ")"
		});

	}

	function getImgColor( $targetImg ){
		
		var myImage = new Image();

		myImage.src = $targetImg.attr( "src" ) ;

		var colorThief = new ColorThief();
		var paletteArray=colorThief.getPalette(myImage, 3);	

		return paletteArray;
		
	}

	function is_touch_device() {

		 return (('ontouchstart' in window) || (navigator.MaxTouchPoints > 0)|| (navigator.msMaxTouchPoints > 0));

	}

	var dMin = 50;
	var dStd = 200;
	var dMax = 800;

	function setAnimateBG(){

		var rVal = $(window).width()/(4*Math.sin(Math.PI/8));

		$(".circle-bg .circle-1").css({

			"transform" : "rotateY(90deg) translateZ(-" + rVal * Math.sin(Math.PI/8*3) + "px)"

		})

		$(".circle-bg .circle-2").css({

			"transform" : "rotateY(45deg) translateZ(-" + rVal * Math.sin(Math.PI/8*3) + "px)"

		})

		$(".circle-bg .circle-3").css({

			"transform" : "translateZ(-" + rVal * Math.sin(Math.PI/8*3) + "px)"

		})

		$(".circle-bg .circle-4").css({

			"transform" : "rotateY(-45deg) translateZ(-" + rVal * Math.sin(Math.PI/8*3) + "px)"

		})
		$(".circle-bg .circle-5").css({

			"transform" : "rotateY(-90deg) translateZ(-" + rVal * Math.sin(Math.PI/8*3) + "px)"

		})

		var circleWidth = $(window).width()/2;
		var circleHeight = $(window).height()*2;

		var circleStarVal;
		var bgStarVal;

		if(isTouchDevice){

			circleStarVal = 80;
			bgStarVal = 100;

		}else{

			circleStarVal = 55;
			bgStarVal = 60;

		}

		$(".circle-bg .circle").each(function (){

			for( var i = 0 ; i <circleStarVal; i ++ ){

				var rndX = getRandNum( 1000, 0 );
				var rndY = getRandNum( 1000, 0 );
				var rndR = getRandNum( 3, 1 );

				var $singleCircle = $("<div></div>");

				$singleCircle.css({

					"width" : rndR*2,
					"height" : rndR*2,
					"border-radius" : rndR,
					"top" : rndY/10 + "%",
					"left" : rndX/10 + "%",
					"position" : "absolute",
					"background-color" : "#fff"

				}).appendTo($(this));


			}


		})

		for( var i = 0 ; i <bgStarVal; i ++ ){

			var rndX = getRandNum( 1000, 0 );
			var rndY = getRandNum( 1000, 0 );
			var rndR = getRandNum( 2, 1 );

			var $singleCircle = $("<div></div>");

			$singleCircle.css({

				"width" : rndR*2,
				"height" : rndR*2,
				"border-radius" : rndR,
				"top" : rndY/10 + "%",
				"left" : rndX/10 + "%",
				"position" : "absolute",
				"background-color" : "#eee"

			}).prependTo($(".bg-animate .star-bg"));

		}

	}

	function catBGAnimation( mouseX, mouseY, activeMode ){

		var rotXVal;
		var rotYVal;

		switch (activeMode){

			case "mouse":

				rotXVal = ( mouseX - $(window).width()/2 )/($(window).width()/2);
				rotYVal = -( mouseY - $(window).height()/2 )/($(window).height()/2);
				break;

			case "device":

				rotXVal = mouseX / 5;
				rotYVal = -mouseY / 5;
				break;

		}

		$(".circle-bg").css({

			"transform" : "rotateX(" + rotYVal*18 + "deg) rotateY(" + rotXVal*18 + "deg) rotateZ(18deg)"

		})

		$(".star-bg").css({

			"transform" : "rotateX(" + rotYVal*24 + "deg) rotateY(" + rotXVal*24 + "deg) translateZ(-" + $(window).width()/4 + "px)"

		})

		$(".svg-pic").css({

			"transform" : "rotateX(" + rotYVal*18 + "deg) rotateY(" + rotXVal*15 + "deg)"

		})
	}

	function getRandNum( limitVal, minVal ){

		var returnVal = Math.floor( Math.random()*limitVal );

		if( returnVal < minVal ){ returnVal = minVal }

		return returnVal;

	}

	var preAx = 0;
	var preAy = 0;

	isTouchDevice = is_touch_device();
	console.log(isTouchDevice);

	if(isTouchDevice){

//		$(".svg-pic-1").remove();
		$(".svg-pic-2").remove();

	}else{

		$("#book-cat").mousemove(function( event ) {

			catBGAnimation( event.pageX, event.pageY, "mouse");

		});

	}

	if (window.DeviceMotionEvent == undefined) {

		$(".test-Data").hide();

	}else{

		window.ondevicemotion = function(event) {

			ax = Math.floor( event.accelerationIncludingGravity.x*10 )/10;
			ay = Math.floor( event.accelerationIncludingGravity.y*10 )/10;
  			az = event.accelerationIncludingGravity.z;
  			rotation = event.rotationRate;

			$(".test-Data").hide();

  			if(ax){

  				var deltX = preAx - ax;
  				var deltY = preAy - ay;

  				if( deltX >= 0.3 || deltX <= -0.3){

  					preAx = ax

  				}

  				if( deltY >= 0.3 || deltY <= -0.3){

  					preAy = ay

  				}

	  			$(".test-Data").html("ax:" + preAx + "<br/> ay:" + preAy + "<br/> az:" + az + "<br/> rotation:" + rotation );
  				catBGAnimation( preAx, preAy, "device");

  			}

		}

	}

	setAnimateBG();
	loadConfigData();
	
})