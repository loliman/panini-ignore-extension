var hiddenText = '<article class="wbbPost wbbPostDeleted wbbPostHidden message messageCollapsed jsClipboardObject userOnlineGroupMarking3"><div class="messageHeader"><ul class="messageQuickOptions"></ul>		<div class="box24">			<div class="framed userLink"><div style="width: 24px; height: 24px; font-size: 23px;" alt="" class="userAvatarImage  icon icon24 icon-ban-circle"></div></div>			<div>				<h1>Beitrag geblockt!</h1>				<small>Dieser Beitrag wurde durch die Panini Ignore Extension automatisch ausgeblendet. Klicke hier um den Beitrag dennoch anzuzeigen.	</small>			</div>		</div>	</div></article>';  
var hideButtons = '<a class="badge" style="visibility: hidden;"></a><a class="badge 	hideBadge" style="background-color:red;">X</a>';

$(document).ready(function() {
	var ignoreli = $('#ignoreUser');
	
	/*There is a ignore button on the Thread Page, but its only rendered on mouseover... maybe I'll hook up with this in the future
	if(ignoreli.length == 0) {
		ignoreli = $('.jsIgnoreButton');
	}*/
			
	if(ignoreli.length != 0) {
		ignoreBtn = ignoreli.children().first();
		ignoreBtn.click(
			function() {
				var id = $('#userProfileCommentList').attr('data-object-id');
							
				var ignoredUsers;
				chrome.storage.sync.get(null, function(items) {
					ignoredUsers = items.ignoredUsers;
						
					if(ignoredUsers == null) {
						ignoredUsers = [];
					}

					if(!ignoreBtn.hasClass('active')) {
						ignoredUsers.push(id);
					} else {
						ignoredUsers = $.grep(ignoredUsers, function(value) {
							return value != id;
						});
					}
							
					var obj = {};
					obj['ignoredUsers'] = ignoredUsers;		
					chrome.storage.sync.set(obj, function() {
						//Nothing
					});
				});
			}
		);
	} else {
		var ignoredUsers;
	
		chrome.storage.sync.get(null, function(items) {
			ignoredUsers = items.ignoredUsers		
				
			if(ignoredUsers != null) {
				$('.marginTop').each(function() {
					if($.inArray($(this).children().first().attr('data-user-id'), ignoredUsers) != -1) {
						var text = $(this).children().first();
						text.css('display', 'none');

						hiddenText = hiddenText.replace('<article', '<article id="' + text.attr('id') + '_hidden"');
						$(this).append(hiddenText);

						var hidden = $('#' + text.attr('id') + '_hidden');
						hidden.css('display', 'block');
					    hidden.click(function() {	
								text.css('display', 'block');
								hidden.css('display', 'none');
						  	}
						);
						
						var badge = $(this).find('.badge').not('.likesBadge').not('.userTitleBadge');
						badge.parent().append(hideButtons);		
						var hideBadge = $(this).find('.hideBadge');		

						var baloon = $('#balloonTooltip');
						var oldBadge = baloon.find('#balloonTooltipText').text();
						hideBadge.mouseover(function() {
								baloon.find('#balloonTooltipText').text('Beitrag verbergen');
								baloon.css('display', 'block');
								baloon.css('top', hideBadge.offset().top+23);
								baloon.css('left', hideBadge.offset().left-13.5);
							}
						);
						
						hideBadge.mouseleave(function() {
								baloon.find('#balloonTooltipText').text(oldBadge);
								baloon.css('display', 'none');
							}
						);
						
						hideBadge.click(function() {	
								text.css('display', 'none');
								hidden.css('display', 'block');
						  	}
						);						
					}
				});
			}
		});
	}
}, false);