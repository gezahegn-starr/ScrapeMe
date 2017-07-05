var bufferTask = new Task();

var taskNames = ["googleSearchTasks",
                 "scrapeTchannelsChannels",
                 "scrapeTlgrmChannels",
                 "scrapeTsearchChannels",
                 "scrapeTsearchChannelsList",
                 "fungusBot",
                 "sashaBotReadChannelsFromInterface",
                 "sashaBotReadChannelsFromNavBar",
                 "sashaBotReadChannelsFromInterfaceInf",
                 "sashaBotReadChannelsFromNavBarInf",
                 "clearCache"];

function tasksManager(taskName) {
    bufferTask = new Task();

    switch(taskName) {
        case "googleSearchTasks":
            bufferTask = new Task({taskName: taskName, rootPageHost: "google.com", rootPageSubref: "?q=start", targetPages: "rootPageOnly"});
            bufferTask.addSubtask({purpose: "navigation", action: "wait", description: {duration: 200}});
            //put down the search query
            bufferTask.addSubtask({purpose: "navigation", action: "setInputValue", stepMinimumLength: 100, description: {selector: "input.gsfi", textSuffix: ""}});
            //brute force the parameters
            bufferTask.addSubtask({purpose: "navigation", action: "click", description: {selector: "button.sbico-c", mouseEvent: "mousedown", jQueryStyle: false}});
            bufferTask.addSubtask({purpose: "navigation", action: "click", description: {selector: "button.sbico-c", mouseEvent: "mousedown", jQueryStyle: true}});
            bufferTask.addSubtask({purpose: "navigation", action: "click", description: {selector: "button.sbico-c", mouseEvent: "click", jQueryStyle: false}});
            bufferTask.addSubtask({purpose: "navigation", action: "click", description: {selector: "button.sbico-c", mouseEvent: "click", jQueryStyle: true}});
            //wait until results get loaded
            bufferTask.addSubtask({purpose: "navigation", action: "check", description: {duration: 5000, property: "presence", selector: "cite._Rm:first"}});
            bufferTask.addSubtask({purpose: "scraping", stepMinimumLength: 2000, action: "save"});
            break;

        case "scrapeTchannelsChannels":
            bufferTask = new Task({taskName: taskName, rootPageHost: "tchannels.me", targetPages: "vaultPages", pageUrlPrefix: "", freezeLimit: 300000});
            bufferTask.addSubtask({purpose: "scraping", action: "scroll"});
            break;

        case "scrapeTlgrmChannels":
            bufferTask = new Task({taskName: taskName, rootPageHost: "tlgrm.ru", targetPages: "vaultPages", pageUrlPrefix: ""});
            bufferTask.addSubtask({purpose: "navigation", action: "scroll", description: {regime: "toTheEnd", duration: 100, period: 40, step: 100}});
            bufferTask.addSubtask({purpose: "scraping", action: "save"});
            break;

        case "scrapeTsearchChannelsList":
            bufferTask = new Task({taskName: taskName, rootPageHost: "tsear.ch", rootPageSubref: "/list/ru/", pageUrlPrefix: "http://", freezeLimit: 300000});
            bufferTask.addSubtask({purpose: "scraping", action: "save", paginationRegime: "multiplePages"});
            break;

        case "scrapeTsearchChannels":
            bufferTask = new Task({taskName: taskName, rootPageHost: "tsear.ch", rootPageSubref: "/go?s=@__&st=1&sl=ru", pageUrlPrefix: "http://", freezeLimit: 300000});
            bufferTask.addSubtask({purpose: "navigation", action: "setInputValue", description: {selector: "div.panel-body form.main-search input"}});
            bufferTask.addSubtask({purpose: "navigation", action: "click", causesReload: true, description: {selector: "div.panel-body form.main-search button"}});
            bufferTask.addSubtask({purpose: "scraping", action: "save", paginationRegime: "multiplePages"});
            break;

        case "fungusBot":
            bufferTask = new Task({taskName: taskName, rootPageHost: "web.telegram.org", rootPageSubref: "/#/im", freezeLimit: 86400000});
            bufferTask.addSubtask({purpose: "navigation", action: "check", errorHandling: "superhard", description: {duration: 300000, property: "presence", selector: "div.login_page_wrap", inverseCheckLogic: true}});
            bufferTask.addSubtask({purpose: "navigation", action: "wait", description: {reason: "ajax", lifeId: "fungusBot", persistence: true}});
            bufferTask.addSubtask({purpose: "steering", action: "loop", description: {anchorSubtask: 1}});
            break;

        case "sashaBotReadChannelsFromInterface":
            bufferTask = new Task({taskName: taskName, rootPageHost: "web.telegram.org", rootPageSubref: "/#/im"});
            //wait until stuff gets loaded
            bufferTask.addSubtask({purpose: "navigation", action: "wait", description: {duration: 1500}});
            //type the channel id
            bufferTask.addSubtask({purpose: "navigation", action: "setInputValue", description: {selector: "input.im_dialogs_search_field", inputApproach: "injectedScript"}});
            //check there is no error
            //bufferTask.addSubtask({purpose: "navigation", action: "check", errorHandling: "superhard", description: {duration: 3000, property: "presence", selector: "div.error_modal_wrap", happenMode: "bad"}});
            //check the channel is found, if yes - select it
            bufferTask.addSubtask({purpose: "navigation", action: "check", description: {duration: 10000, property: "content", selector: "div.im_dialogs_contacts_wrap:not('.ng-hide') ul > li:first span.im_dialog_message_text", containsSource: "searchTasks"}});
            bufferTask.addSubtask({purpose: "navigation", action: "click", description: {selector: "div.im_dialogs_contacts_wrap:not('.ng-hide') ul > li:first > a.im_dialog", jQueryStyle: false, mouseEvent: "mousedown"}});
            //wait until client switches to that channel
            bufferTask.addSubtask({purpose: "navigation", action: "wait", description: {duration: 1500}});
            //check it is channel, channel has members there
            bufferTask.addSubtask({purpose: "navigation", action: "check", description: {duration: 10000, property: "content", selector: "div.tg_head_peer_title_wrap span.tg_head_peer_status span:first", containsText: "member"}});
            bufferTask.addSubtask({purpose: "navigation", action: "check", description: {duration: 10000, property: "count", selector: "div.im_history_messages_peer:not('.ng-hide') div.im_history_message_wrap, div.im_history_messages_peer:not('.ng-hide') div.im_service_message", total: 1}});
            //scroll to bottom (you might find yourself in the middle of chat)
            bufferTask.addSubtask({purpose: "navigation", action: "scroll", description: {regime: "toTheEnd", approach: "modern", approachSelector: "div.im_history_scrollable_wrap.nano-content", step: 100, period: 20, selector: "", checkLimit: 50}});
            //start scrolling the history up to load more and more messages
            bufferTask.addSubtask({purpose: "navigation", action: "scroll", description: {regime: "toTheEnd", approach: "modern", approachSelector: "div.im_history_scrollable_wrap.nano-content", step: -200, period: 20, selector: "", checkLimit: 50, showStopper: "telegramChannel"}});
            //save comprehensive statistics about messages history
            bufferTask.addSubtask({purpose: "scraping", action: "save", description: {partOfPageId: "fullContent"}});
            break;

        case "sashaBotReadChannelsFromInterfaceInf":
            bufferTask = new Task({taskName: taskName, rootPageHost: "web.telegram.org", rootPageSubref: "/#/im", forceNewWindowForNewTask: true, freezeLimit: 300000}); //5 minutes is maximum for freeze
            bufferTask.addSubtask({purpose: "navigation", action: "wait", description: {duration: 1500}});
            bufferTask.addSubtask({purpose: "navigation", action: "setInputValue", description: {selector: "input.im_dialogs_search_field", inputApproach: "injectedScript"}});
            //bufferTask.addSubtask({purpose: "navigation", action: "check", errorHandling: "superhard", description: {duration: 3000, property: "presence", selector: "div.error_modal_wrap", happenMode: "bad"}});
            bufferTask.addSubtask({purpose: "navigation", action: "check", description: {property: "content", selector: "div.im_dialogs_contacts_wrap:not('.ng-hide') ul > li:first span.im_dialog_message_text", containsSource: "searchTasks"}});
            bufferTask.addSubtask({purpose: "navigation", action: "click", description: {selector: "div.im_dialogs_contacts_wrap:not('.ng-hide') ul > li:first > a.im_dialog", jQueryStyle: false, mouseEvent: "mousedown"}});
            bufferTask.addSubtask({purpose: "navigation", action: "wait", description: {duration: 5000}});
            bufferTask.addSubtask({purpose: "navigation", action: "check", description: {duration: 10000, property: "content", selector: "div.tg_head_peer_title_wrap span.tg_head_peer_status span:first", containsText: "member"}});
            bufferTask.addSubtask({purpose: "navigation", action: "check", description: {duration: 10000, property: "count", selector: "div.im_history_messages_peer:not('.ng-hide') div.im_history_message_wrap, div.im_history_messages_peer:not('.ng-hide') div.im_service_message", total: 1}});
            bufferTask.addSubtask({purpose: "navigation", action: "scroll", description: {regime: "toTheEndCustom", approach: "modern", approachSelector: "div.im_history_scrollable_wrap.nano-content", step: -1000000, period: 1000, selector: "", checkLimit: 300, showStopper: "telegramChannelFull"}});
            bufferTask.addSubtask({purpose: "scraping", action: "save", description: {partOfPageId: "channelBirthday"}});
            break;

        case "sashaBotReadChannelsFromNavBar":
            bufferTask = new Task({taskName: taskName, rootPageHost: "web.telegram.org", rootPageSubref: "/#/im", targetPages: "vaultPages", pageUrlPrefix: "https://web.telegram.org/#/im?p="});
            //wait until stuff gets loaded
            bufferTask.addSubtask({purpose: "navigation", action: "wait", description: {duration: 1500}});
            //check there is no error window
            bufferTask.addSubtask({purpose: "navigation", action: "check", errorHandling: "superhard", description: {duration: 3000, property: "presence", selector: "div.error_modal_wrap", happenMode: "bad"}});
            //check it's group or channel, skip bots
            bufferTask.addSubtask({purpose: "navigation", action: "check", description: {duration: 10000, property: "content", selector: "div.tg_head_peer_title_wrap span.tg_head_peer_status span:first", containsText: "member"}});
            //check there is at least one message (service or whatever)
            bufferTask.addSubtask({purpose: "navigation", action: "check", description: {duration: 10000, property: "count", selector: "div.im_history_messages_peer:not('.ng-hide') div.im_history_message_wrap, div.im_history_messages_peer:not('.ng-hide') div.im_service_message", total: 1}});
            //scroll to bottom (you might find yourself in the middle of chat)
            bufferTask.addSubtask({purpose: "navigation", action: "scroll", description: {regime: "toTheEnd", approach: "modern", approachSelector: "div.im_history_scrollable_wrap.nano-content", step: 100, period: 20, selector: "", checkLimit: 50}});
            //start scrolling the history up to load more and more messages
            bufferTask.addSubtask({purpose: "navigation", action: "scroll", description: {regime: "toTheEnd", approach: "modern", approachSelector: "div.im_history_scrollable_wrap.nano-content", step: -200, period: 20, selector: "", checkLimit: 50, showStopper: "telegramChannel"}});
            //save comprehensive statistics about messages history
            bufferTask.addSubtask({purpose: "scraping", action: "save", description: {partOfPageId: "fullContent"}});
            break;

        case "sashaBotReadChannelsFromNavBarInf":
            bufferTask = new Task({taskName: taskName, rootPageHost: "web.telegram.org", rootPageSubref: "/#/im", forceNewWindowForNewTask: true, freezeLimit: 300000, targetPages: "vaultPages", pageUrlPrefix: "https://web.telegram.org/#/im?p="});
            bufferTask.addSubtask({purpose: "navigation", action: "wait", description: {duration: 1500}});
            bufferTask.addSubtask({purpose: "navigation", action: "check", errorHandling: "superhard", description: {duration: 3000, property: "presence", selector: "div.error_modal_wrap", happenMode: "bad"}});
            bufferTask.addSubtask({purpose: "navigation", action: "check", description: {duration: 10000, property: "content", selector: "div.tg_head_peer_title_wrap span.tg_head_peer_status span:first", containsText: "member"}});
            bufferTask.addSubtask({purpose: "navigation", action: "check", description: {duration: 10000, property: "count", selector: "div.im_history_messages_peer:not('.ng-hide') div.im_history_message_wrap, div.im_history_messages_peer:not('.ng-hide') div.im_service_message", total: 1}});
            bufferTask.addSubtask({purpose: "navigation", action: "scroll", description: {regime: "toTheEndCustom", approach: "modern", approachSelector: "div.im_history_scrollable_wrap.nano-content", step: -1000000, period: 1000, selector: "", checkLimit: 300, showStopper: "telegramChannelFull"}});
            bufferTask.addSubtask({purpose: "scraping", action: "save", description: {partOfPageId: "channelBirthday"}});
            break;

        case "clearCache":
            //do nothing
            break;
    }

    return bufferTask;
}
