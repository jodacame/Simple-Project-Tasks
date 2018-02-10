chrome.storage.sync.get("current_projects", function (obj) {      

	  if(!obj.current_projects)
        return false;
  
      chrome.storage.sync.get("tasks", function (obj2) {    	
      var i=0;

       if(obj2.tasks)
       {  
       		obj2.tasks.forEach(function(val) {
				                           
                if(val.idp == obj.current_projects)
                {
                   i++;
                }
           
				});
				
        }
        chrome.browserAction.setBadgeBackgroundColor({ color:"#D50000" });
		    chrome.browserAction.setBadgeText({text: i.toString() });
    });

    
});


