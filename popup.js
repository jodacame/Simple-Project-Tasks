var hide_completed = true;
var current_id = 500;
var current_projects = 0;

$(function () {
    $(document).on('click', ".projects ul li", function(event) {
        event.preventDefault();
        $(".projects ul li.active").removeClass('active');
        $(this).addClass('active');
        $(".header span").text($(this).text());
        current_projects = $(this).attr("data-id");
        chrome.storage.sync.set({"current_projects":$(this).attr("data-id")});
        loadTasksProject($(this).attr("data-id"));
        $(".question").removeClass('show');
        $("#main .tasks .new").addClass("show");
        $("#main .tasks .new input").focus();
      
    });
    $(document).on('click', ".new button", function(event) {
        event.preventDefault();
        var name = $(".new input").val();
        if(name.trim())
        {
            $(".tasks ul").empty();
            var id = current_id;
            var _elm = $("<li data-id="+id+" class='truncate'><i class='zmdi zmdi-folder'></i> <span>"+name+"</span></li>");
            $(".projects ul").append(_elm);
            $(".new input").val("");
           
            current_id++;
            chrome.storage.sync.set({"current_id":current_id});
            
            saveProjecs();

             _elm.trigger('click');

            $('.projects ul').animate({
                scrollTop: $(".projects ul li.active").offset().top-60},
            'normal');

        }
    });    

    $(".tasks ul li").makeSearchTask();
    $(document).on('click', ".btn-delete-project", function(event) {
        event.preventDefault();   
        $("#main .tasks .new").removeClass("show");
        $(".btn-open-question").removeClass('active');
        $(".tasks ul li[data-idp='"+$(".projects ul li.active").attr("data-id")+"']").remove();
        $(".projects ul li[data-id='"+$(".projects ul li.active").attr("data-id")+"']").remove();
        
        saveProjecs();
        saveTasks();
        $(".tasks ul").empty();
         $(".question").removeClass('show');
        $(".projects ul li:first").click();

          $('.projects ul').animate({
                scrollTop: $(".projects ul li.active").offset().top-60},
            'normal');

        
    });   

    $(document).on('click', ".btn-delete-task", function(event) {
        event.preventDefault();   
        $(this).parent().remove();
        
        
        
        saveTasks();
          
        
    });       


    $(document).on('click', ".btn-search", function(event) {
        event.preventDefault();   
        $("#main .header .search").toggleClass('show');
        $(this).toggleClass('active');
        if($("#main .header .search").hasClass('show'))
        {
             $("#main .header .search input").focus();
        }else
        {

            $("#main .header .search input").val("");   
            $("#main .header .btn-search").removeClass('active');
            $("#main .header .search input").trigger('change');
        }
        
        saveTasks();
          
        
    });   

    $(document).on('click', ".btn-about", function(event) {
        event.preventDefault();   
        $("#about").toggleClass('show');
        
    });  

    $(document).on('click', ".btn-show-all", function(event) {
        event.preventDefault();   
        if($(this).hasClass('active'))
        {   
            $(this).removeClass('active');
            hide_completed = false;
        }else
        {
            $(this).addClass('active');
            hide_completed = true;
        }
        
        var idp = $(".projects ul li.active").attr("data-id");
        loadTasksProject(idp);
        
    });   

    $(document).on('click', ".btn-open-question", function(event) {
        event.preventDefault();   
        $(".question .np").html("Do you want remove <i>"+$(".projects ul li.active").text()+"?</i>");
        $(".question").toggleClass('show');
        $(".btn-open-question").toggleClass('active');
        
    });  

    $(document).on('click', ".tasks ul li i.icon", function(event) {
        event.preventDefault();
        var completed = $(this).parent().attr("data-completed");
        var idp = $(this).parent().attr("data-idp");
        var _this = $(this);
        $(this).parent().removeClass('animated');
        if( completed && completed != 'false')
        {
            $(this).parent().find("strong").remove();
            $(this).parent().removeAttr('data-completed');
            $(this).parent().removeClass('hide');
            $(this).replaceWith('<i class="zmdi icon zmdi-square-o"></i>'); 

        }
        else
        {
            $(this).parent().append('<strong class="text-green">'+getNow()+'</strong>');
            if($(".btn-show-all").hasClass('active'))
            {


                $(this).parent().slideToggle('fast', function() {
                    _this.parent().addClass('hide');
                });
            }
            
            $(this).parent().attr('data-completed', getNow());
            $(this).replaceWith('<i class="zmdi icon zmdi-check"></i>');                        
            
        }        
       
        saveTasks();
       // $(".projects ul li[data-id='"+idp+"']").trigger('click');        
    });
    $(document).on('keypress', '.new input', function(event) {        
            if(event.which == 13) {
                $(".new button").trigger('click');
            }
    }); 

    $( ".tasks ul" ).sortable({
         handle: ".move",
         update: function( event, ui ) {
            saveTasks();
         }
    });
    

    $(document).on('keypress', '.tasks input', function(event) {        
            if(event.which == 13) {
                
                var name = $(".tasks input").val();
                var idp = $(".projects ul li.active").attr("data-id");
                if(name.trim())
                {
                   

                    var now = getNow();
                    var id = $(".tasks ul li").length+1;
                     var icon = '<i class="zmdi icon zmdi-square-o"></i>';
                    var _elm = $("<li title='"+name+"' data-id="+id+" data-idp="+idp+" data-created='"+now+"' class='truncate'><div class='move'></div>"+icon+"<span>"+name+"</span><small>"+now+'</small> <i class="zmdi btn-delete-task delete zmdi-delete"></i></li>');                    
                    $(".tasks ul").append(_elm);
                    $(".tasks input").val("");                    
                    saveTasks();
                    //loadTasksProject(idp);
                     $('.tasks ul').animate({
                        scrollTop: $('.tasks ul').prop("scrollHeight")},
                    'fast');
                }
            }
    });

    setTimeout(function() {

            chrome.storage.sync.get("current_id", function (obj) {      
                if(obj.current_id)
                    current_id = obj.current_id;
            });

            chrome.storage.sync.get("projects", function (obj) {       
                $(".projects ul").empty();
                $.each(obj.projects, function(index, val) {
                    var _elm = $("<li data-id="+val.id+" class='truncate'><i class='zmdi zmdi-folder'></i> <span>"+val.name+"</span></li>");
                    $(".projects ul").append(_elm);
                });
                $("#loading").fadeOut(300);
            });

            chrome.storage.sync.get("current_projects", function (obj) {      
                console.log(obj);
                $(".projects ul li[data-id='"+obj.current_projects+"']").trigger('click');  

                 $('.projects ul').animate({
                    scrollTop: $(".projects ul li.active").offset().top-60},
                'fast');

            }); 
            

    }, 500);
    



});

function getNow()
{
        var date = new Date();
        var year = date.getFullYear();
        var month = (1 + date.getMonth()).toString();
        month = month.length > 1 ? month : '0' + month;
        var day = date.getDate().toString();
        day = day.length > 1 ? day : '0' + day;

        var now = year+"-"+month+"-"+day;
        return now;
}
function saveProjecs()
{
    var projects = [];
    $.each($(".projects ul li"), function(index, val) {
       var name = $(val).find("span").text();
       var id = $(val).attr("data-id");
        projects.push({id:id,name:name});        
    });
    chrome.storage.sync.set({"projects":projects});    
}

function saveTasks()
{
    
     var tasks = {};
    var taskOBJ = [];
    var i =0;
    $.each($(".tasks ul li"), function(index, val) {
       var name = $(val).find("span").text();
       var id = $(val).attr("data-id");
       var idp = $(val).attr("data-idp");
       var created = $(val).attr("data-created");
       var completed = $(val).attr("data-completed");
        if(!completed || completed == 'false')
         completed = false;
        if(current_projects == idp)
        {
            i++;
             taskOBJ.push({id:id,idp:idp,name:name,created:created,completed:completed});        

        }
    });
   // console.log(tasks);
     var taskID = "tasks_"+current_projects;
     tasks[taskID]  = taskOBJ;
             
    chrome.storage.sync.set(tasks);  

     chrome.browserAction.setBadgeBackgroundColor({ color: "#D50000" });
        chrome.browserAction.setBadgeText({text: i.toString()});

   
}
function migrateTask()
{
     if(localStorage.newSystemtask != 1)
     {
        for (var i = 0; i < 1000; i++) {
            var tasks = {};
            var taskOBJ = [];
            var save = false;
           $.each($(".tasks ul li"), function(index, val) {
               var name = $(val).find("span").text();
               var id = $(val).attr("data-id");
               var idp = $(val).attr("data-idp");
               var created = $(val).attr("data-created");
               var completed = $(val).attr("data-completed");
                if(!completed || completed == 'false')
                 completed = false;
                if(i == idp)
                {
                    save = true;
                   taskOBJ.push({id:id,idp:idp,name:name,created:created,completed:completed});        
                }
            });
            var taskID = "tasks_"+i;
           
            if(save){

              
               
                    tasks[taskID]  = taskOBJ;
                 console.log(taskID);
                 console.log(tasks);
                chrome.storage.sync.set(tasks); 
               
            }
        }
        localStorage.newSystemtask = 1;
     }
} 

function loadTasksProject(idproject)
{

    if(!idproject)
        return false;

       $("#main .header .search").removeClass('show');
        $("#main .header .btn-search").removeClass('active');
        $("#main .header .search input").val("");   
        $("#main .header .search input").trigger('change');

     $(".tasks ul").empty();
    var taskID = "tasks";
    if(localStorage.newSystemtask == 1)
    {
        taskID = "tasks_"+idproject;
    }

      chrome.storage.sync.get(taskID, function (obj) {  
      var i =0; 
      console.log(obj);
       if(obj)
       {
            $.each(obj[taskID], function(index, val) {
                var visible = "hide";
                if(val.idp == idproject)
                {

                    visible = "";
                }

                    var icon = '<i class="zmdi icon zmdi-square-o"></i>';
                    if(val.completed && val.completed != 'false')
                    {
                         icon = '<i class="zmdi icon zmdi-check"></i>';
                         val.completed = ' <strong class="text-green">'+val.completed+'</strong>';
                         if(hide_completed)
                            visible = 'hide';
                    }
                    else
                    {
                       val.completed= ''; 
                       if(visible == '')
                            i++;
                    }

                    var _elm = $("<li class='"+visible+"' data-created='"+val.created+"' data-completed='"+$.trim($("<p>"+val.completed+"</p>").text())+"'  title='"+val.name+"' data-id="+val.id+" data-idp="+val.idp+" class='truncate'><div class='move'></div>"+icon+"<span>"+val.name+"</span><small>"+val.created+"</small>"+val.completed+' <i class="zmdi btn-delete-task delete zmdi-delete"></i>'+"</li>");
                    $(".tasks ul").append(_elm);    
                
                
            });
        }

        chrome.browserAction.setBadgeBackgroundColor({ color: "#D50000" });
        chrome.browserAction.setBadgeText({text: i.toString()});
        if(localStorage.newSystemtask != 1)
        {
            migrateTask();
        }
    });
}
jQuery.fn.makeSearchTask = function() {     
    input = $("#main .header .search input");   
    
    $(this).prepend(input);
    var list    = $(".tasks ul");
    $(input)
          .change( function () {
            var filter = $(this).val();         
            if(filter) {                
            $("li",$(list)).hide();
              $("li:Contains(" + filter + ")",$(list)).show();
            } else {                
                $("li",$(list)).show();
            }
            return false;
          })
        .keyup( function () {           
            $(this).change();
        });   
 
        // Creamos la pseudo-funcion Contains
        jQuery.expr[":"].Contains = jQuery.expr.createPseudo(function(arg) {
            return function( elem ) {
                return jQuery(elem).text().toUpperCase().indexOf(arg.toUpperCase()) >= 0;
            };
        });
 
};
