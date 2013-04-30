//Login.js class

define( [
	"dojo/_base/declare",
	"dojo",
	"dojox",
	"dojo/request",
  "dijit/dijit",
  "dojo/parser",
  "dojo/selector/acme",
  "dijit/TitlePane",
  "dijit/Toolbar",
  "dijit/form/Button",
  "dojox/form/CheckedMultiSelect",
  "dojox/io/xhrScriptPlugin",
  "dojo/data/ItemFileReadStore",
  "dojox/data/CsvStore",
  "dijit/MenuBar",
  "dijit/PopupMenuBarItem",
  "dijit/MenuItem",
  "dijit/Menu",
  "dijit/form/SimpleTextarea",
  "dijit/form/TextBox",
  "dijit/form/CheckBox",
  "dijit/layout/TabContainer",
  "dijit/layout/ContentPane",
//  "dojox/mobile/deviceTheme",
//  "dojox/mobile/compat",
  "dojo/hash",
  "dojox/io/xhrScriptPlugin",
  "dojo/data/ItemFileReadStore",
  "dojox/mobile/RoundRectDataList",
  "dijit/form/DataList",
  "dojox/mobile/ComboBox",
  "dojox/mobile/ToolBarButton",
  "dijit/layout/ContentPane",
  "dijit/form/Form",
  "dojox/mobile/TextBox",
  "dojox/mobile/Button",
  "dojox/mobile/RoundRectCategory",
  "dojox/widget/Standby",
  "dojox/mobile/TabBar",
  "dojox/mobile/TabBarButton",
  "dojox/mobile/RoundRectDataList",
  "dojox/mobile/RoundRectList",
	"dojox/mobile/TextBox",
	"dojox/mobile/CheckBox",
	"dojox/mobile/ScrollableView",
  "dojox/mobile/TabBar",
  "dijit/Dialog",
  "dojox/widget/Standby",
  "dijit/form/MultiSelect"
], function(declare, dojo, dojox, request) {
	return declare( [], {

		constructor: function() {
			console.log("Login contructor called!");
			//CHECK FILE HERE TO GET SERVER INFO FOR THE VERY FIRST TIME WE RUN.

			if( !! window.localStorage.getItem("myservers") ) {
				this.myservers = dojo.fromJson( window.localStorage.getItem("myservers") );
			} else {
				this.myservers = new Array();
			}
			
			//Change what's shown based on the number of servers found
			if(this.myservers.length == 0) {
				this.myservers = [{ "url":"demo.sitrep.org", "city":"New York", "username":"SitRepDemo","password":"SRDemo115" }]
			}
 
		 this.currentservernum=0; //currentservernum is the server that is selected in the select box on the login page
		 this.clickedservernum=0; //the server that is clicked in the edit menu
		 this.deletepressed=0; //indicates if the delete button has been clicked

			this.uiSetup();
//			dojo.addOnUnload(this.saveToLocalStorage);
		},
		uiSetup: function() {

			if(this.myservers.length>0) {
					dojo.setAttr(dojo.byId("userbox"),"value", this.myservers[0].username);
					dojo.setAttr(dojo.byId("passbox"),"value",this.myservers[0].password);
			}
			
			var srdLogin = this;
			this.theSelect = dojo.create("select", { id:"selectbox" ,onchange:function(e) { this.selectserver(this.theSelect.selectedIndex) }.bind(this)  } , dojo.byId("serverListLocation1")  );
			
			this.theSelect2 = dojo.create("select", { id:"selectbox2" ,onchange:function(e) { this.selectserver(this.theSelect2.selectedIndex) }.bind(this)  } , dojo.byId("serverListLocation2")  );
			for ( i=0;i<this.myservers.length;i++)
			{
				dojo.create("option", { innerHTML:this.myservers[i].url }, this.theSelect);
				dojo.create("option", { innerHTML:this.myservers[i].url }, this.theSelect2);
			}

		},
		saveToLocalStorage: function() {
			console.log("saveToLocalStorage CALLED!");
			window.localStorage.setItem("myservers", dojo.toJson(this.myservers) );
			return;
		},
		updateUserandPass: function(index) {

			console.log("updateUserandPass Called:"+index);
			this.currentservernum=index;
			if( ! index>=0){
	   		dojo.setAttr(dojo.byId("userbox"),"value","");
				dojo.setAttr(dojo.byId("passbox"),"value","");			
				return;
			}
	   	dojo.setAttr(dojo.byId("userbox"),"value",this.myservers[index].username);
			dojo.setAttr(dojo.byId("passbox"),"value",this.myservers[index].password);	
		},

		//BEGIN connectToServer
		connectToServer: function() {
			document.getElementById("loginfeedback").innerHTML="";
	    var standby = dojox.widget.Standby({ 
        target: "root_view" 
 		   }); 
	    document.body.appendChild(standby.domNode); 
	    standby.startup(); 
			standby.show(); 

			var srdLogin = this;

			var username = dojo.getAttr(dojo.byId("userbox"),"value");
			var password = dojo.getAttr(dojo.byId("passbox"),"value");

			serverBaseUrl = "http://"+this.myservers[this.currentservernum].url;
			var serverUrl = serverBaseUrl+"/login/index/embeddedlogin";
			var theData = dojo.toJson( { "username": username, "password": password } );
//			var theData = { "username": username, "password": password };

			console.log("Username :"+username+" , password:"+password);

			var xhrArgs = {
//				url: serverUrl,
				timeout: 4000,
//				method: 'POST',
				handleAs: 'json',
				data: theData
//				headers: { 'Content-Type' : 'application/json' }
			};
			console.log("Sending Auth Request");
//			window.location.href = serverBaseUrl;
			request.post(serverUrl, xhrArgs).then(function(data) {
				console.log("Finished auth request");
				standby.hide(); 
				if(data != null && data.authenticated != null && data.authorized != null) {
					console.log("auth="+data.authenticated);
					console.log("author="+data.authorized);
					if(data.authenticated == true && data.authorized == true) {

						console.log("Successfully Authenticated & autorized!");
						// USER HAS SUCCESFULLY AUTH REDIRCT TO THE HOME PAGE.
//						window.location.href = serverBaseUrl+"/home/index/localindex";
//						window.location.href = serverBaseUrl;
							srdLogin.loadSitRepFrame();

//						dojo.create( 'iframe', { "src": 'main_frame.html', "style":"border: 0; width: 100%; height: 100%" } , dojo.byId("body") );
					} else if(data.authenticated != true){
							document.getElementById("loginfeedback").innerHTML="Invalid username or password!";
					} else if(data.authorized != true){			
							document.getElementById("loginfeedback").innerHTML="This user is not authorized to connect to this server!";
					}
				} else {
					document.getElementById("loginfeedback").innerHTML="Error: could not connect to server!";
				}
			}, function(theError) {
				standby.hide(); 	
				document.getElementById("loginfeedback").innerHTML="Error: An unknown error occured:"+theError;
				console.log("An unexpected error occured! Error"+theError);
			}
		);

//			var deferred = dojo.xhrPost(xhrArgs);
//			var deferred = xhr(serverUrl,xhrArgs);
		},
		//END connectToServer

		//BEGIN loadSitRepFrame
		loadSitRepFrame: function() {

			dijit.byId("targetPane").set("content", dojo.create("iframe", {
		    "src": "main_frame.html",
		    "style": "border: 0; width: 100%; height: 100%"
			}));  
				
//						dojo.create( 'iframe', { "src": 'main_frame.html', "style":"border: 0; width: 100%; height: 100%" } , dojo.byId("body") );

		},
		//END loadSitRepFrame

		//BEGIN selectserver
		selectserver: function(index)
		{
			console.log("Select Server Called: "+index);	
			document.getElementById("loginfeedback").innerHTML="";
			this.currentservernum=index;
			if(! (index >= 0) ){
	   		dojo.setAttr(dojo.byId("userbox"),"value","");
				dojo.setAttr(dojo.byId("passbox"),"value","");			
	
				dojo.setAttr(dojo.byId("editservername"), "value", "");
				dojo.setAttr(dojo.byId("editusername"), "value", "");
				dojo.setAttr(dojo.byId("editpassword"),"value","");
				dojo.setAttr(dojo.byId("editcity"),"value","");
				return;
			}
	   	dojo.setAttr(dojo.byId("userbox"),"value",this.myservers[index].username);
			dojo.setAttr(dojo.byId("passbox"),"value",this.myservers[index].password);	

			dojo.setAttr(dojo.byId("editservername"),"value",this.myservers[index].url);
			dojo.setAttr(dojo.byId("editusername"),"value",this.myservers[index].username);
			dojo.setAttr(dojo.byId("editpassword"),"value",this.myservers[index].password);
			dojo.setAttr(dojo.byId("editcity"),"value",this.myservers[index].city);
		
			dojo.setAttr(dojo.byId("confirmtext"),"innerHTML", "server " + index + " is ");
			this.deactivatesave();
			
		},
		//END selectserver
		//BEGIN addToSelectBox 
		addToSelectBox : function (a){
	//Add to select box on root_view
		var select = document.getElementById("selectbox");
		var select2 = document.getElementById("selectbox2");
		var opt = document.createElement("option");
    	opt.innerText = this.myservers[a].url;
    	select.appendChild(opt);	
    	select2.appendChild(opt);	
		},

		//BEGIN addNewServer
		addNewServer :	function (){

			this.myservers.push({ "url":"edit.sitrep.org", "city":"Anytown", "username":"","password":""});
			this.currentservernum = this.myservers.length - 1;
			this.addServer();
		},
		//END addNewServer

		//BEGIN addServer
		addServer :	function (){

		var thisservernum=this.currentservernum;

		var opt = document.createElement("option");
   	opt.innerHTML = this.myservers[thisservernum].url;
   	dojo.byId("selectbox").appendChild(opt);
   	dojo.byId("selectbox").selectedIndex=thisservernum;

   	dojo.byId("selectbox2").appendChild(opt);
  	dojo.byId("selectbox2").selectedIndex=thisservernum;

//		this.addToSelectBox(thisservernum);
		
		this.selectserver(thisservernum);
		this.saveserver();
		},
		//END addServer

		//BEGIN deleteserverprep
		deleteserverprep :function () {
			document.getElementById("confirmtext").innerHTML="Are you sure you want to delete " + this.myservers[this.currentservernum].url + "?";
			myDialog.show();
			return;
		},
		//END deleteserverprep

		//BEGIN deleteserver
		deleteserver : function() {	
			//Take items out of array
			this.myservers.splice(this.currentservernum,1);
			
			dojo.byId("selectbox").remove(this.currentservernum);
			dojo.byId("selectbox2").remove(this.currentservernum);
			this.currentservernum=document.getElementById("selectbox").selectedIndex;
//	this.updateUserandPass(document.getElementById("selectbox").selectedIndex);
//	this.selectserver(document.getElementById("selectbox").selectedIndex);
	
			this.saveToLocalStorage();
		},
		//END DELETE SERVER

	//BEGIN saveserver
	saveserver: 	function()
		{
			
		//Add to myservers
		this.myservers[this.currentservernum].url=document.getElementById("editservername").value	
		this.myservers[this.currentservernum].city=document.getElementById("editcity").value
		this.myservers[this.currentservernum].username=document.getElementById("editusername").value
		this.myservers[this.currentservernum].password=document.getElementById("editpassword").value

		//Write this to localStorage....
		this.saveToLocalStorage();

		//Change in edit servers
		//dijit.byId('servernum' + clickedservernum).set("label",myservers[clickedservernum].url);
		dojo.byId("selectbox").options[this.currentservernum].innerHTML=this.myservers[this.currentservernum].url;
		//document.getElementById("serverlist").options[document.getElementById("selectbox").selectedIndex].innerHTML=myservers[document.getElementById("selectbox").selectedIndex].url;
		

			//Change on login page
			dojo.byId("selectbox2").options[this.currentservernum].innerHTML=this.myservers[this.currentservernum].url;
//		this.updateUserandPass(document.getElementById("selectbox").selectedIndex);
	
			this.deactivatesave();

		}, //End of saveserver
	


	 	activatesave : function(){
	 		document.getElementById("savetext").innerHTML="  Click Save to save changes.";
	 		dijit.byId("savebutton").setAttribute("disabled",false);
				
	 	},
	 
		deactivatesave : function(){
	 		dijit.byId("savebutton").setAttribute("disabled",true);	
	 		document.getElementById("savetext").innerHTML="";
	 	} 
	 
		

	});

});
	




 
