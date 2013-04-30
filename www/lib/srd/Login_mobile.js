
define( [
	"dojo/_base/declare",
	"dojo",
	"dojox",
	"dojo/parser",
	"dojo/_base/connect",
	"srd/Login",
	"dojox/mobile/Heading",
	"dojo/domReady!"
], function(declare, dojo, dojox, parser, connect, Login) {
	return declare( [ Login ], {

		//BEGIN CONSTRUCTOR
		constructor: function() {
			console.log("Login_mobile contructor called!");
		},
		//END CONSTRUCTOR
		//BEGIN uiSetup
		uiSetup: function() {

			parser.parse();
			connect.subscribe("/dojox/mobile/deleteListItem", function(item){
		    this.showDeleteButton(item);
		  });

			if(this.myservers.length>0) {
					dojo.setAttr(dojo.byId("userbox"),"value", this.myservers[0].username);
					dojo.setAttr(dojo.byId("passbox"),"value",this.myservers[0].password);
			}
			
			var srdLogin = this;
			this.optionArr = Array();

//			this.theSelect = dojo.create("select",  { size:1, style:"border: solid 1px #999999", id:"selectbox", options:this.optionArr ,onchange:function(e) { this.selectserver(this.theSelect.selectedIndex) }.bind(this)  }, dojo.byId("serverListLocation1")  );
			this.theSelect = dojo.create("select",  { id:"selectbox", srdLogin: this, onchange:function(e) { srdLogin.selectserver(this.options.selectedIndex) }   }, dojo.byId("serverListLocation1")  );
		
			
			this.theSelect2 = new dojox.mobile.RoundRectList( {editable: 'true' }); 
			this.theSelect2.placeAt(dojo.byId("serverListLocation2") );	
			for ( i=0;i<this.myservers.length;i++)
			{
				dojo.create("option", { innerHTML:this.myservers[i].url }, this.theSelect);
//				this.optionArr.push( { label:this.myservers[i].url } );
				var theListItem = new dojox.mobile.ListItem( {
					label: this.myservers[i].url,
					"class": "mbListItem",
					value: i,
					srdLogin: this,
					id: "list2_itemnum_" + i,
					"clickable": "true",
					onClick: function() {
						if( this.srdLogin.deletepressed==0 ) {
							this.srdLogin.selectserver( this.value );
							var w = dijit.byId('server_view');
							w.performTransition('server_data_view',1,"slide",null);	
						} else {
							this.srdLogin.currentservernum = this.value;
							this.srdLogin.deleteserver();
						}
					}

				});
				this.theSelect2.addChild(theListItem);
			}
//			this.theSelect = new Select(); // { id:"selectbox", options:this.optionArr ,onchange:function(e) { this.selectserver(this.theSelect.selectedIndex) }.bind(this)  });
//			this.theSelect.placeAt(dojo.byId("serverListLocation1")  );
//			this.theSelect.startup();
	

		this.theSelect2.startup();

		},
		//END uiSetup
		//BEGIN selectserver
		selectserver: function(index)
		{
			console.log("Select Server Called: "+index);	
			dojo.setAttr(dojo.byId("loginfeedback"),"innerHTML","");
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
		
		},
		//END selectserver

		//BEGIN addServer
		addServer :	function (){
		
		var thisservernum = this.currentservernum;
	
		var opt = dojo.create("option", { "innerHTML":this.myservers[thisservernum].url}, this.theSelect  );
//   	dojo.byId("selectbox").appendChild(opt);
   	dojo.byId("selectbox").selectedIndex=thisservernum;

		var theListItem = new dojox.mobile.ListItem( {
			label: this.myservers[thisservernum].url,
			"class": "mbListItem",
			value: thisservernum,
			srdLogin: this,
			id: "list2_itemnum_" + thisservernum,
			"clickable": "true",
			onClick: function() {
				if( this.srdLogin.deletepressed==0 ) {
					this.srdLogin.selectserver( this.value );
					var w = dijit.byId('server_view');
					w.performTransition('server_data_view',1,"slide",null);	
				} else {
					this.srdLogin.currentservernum = this.value;
					this.srdLogin.deleteserver();
				}
			}

		});
		this.theSelect2.addChild(theListItem);
		
		this.selectserver(thisservernum);
		this.saveserver();
		},
		//END addServer
		//BEGIN deleteserverprep
		deleteserverprep :function () {
//			var theChildren = this.theSelect2.getChildren();
			if(this.deletepressed==0){
				for ( i=0;i<this.myservers.length;i++) {
					//display red circle
					dijit.byId('list2_itemnum_' + i).set("icon", "mblDomButtonRedCircleMinus");
		
					dijit.byId('list2_itemnum_' + i).iconNode.style.display = "inline";
					dijit.byId('list2_itemnum_' + i).rightIconNode.style.display = "none";
				}
				dijit.byId("deletebutton").set("style=","background-color: red");
				dijit.byId('deletebutton').set("label","Cancel");	
				this.deletepressed=1;
			} else {
				dijit.byId('deletebutton').set("label","Delete");
				for ( i=0;i<this.myservers.length;i++) {
					//hide red cirlce
					dijit.byId('list2_itemnum_' + i).iconNode.style.display = "none";
					dijit.byId('list2_itemnum_' + i).rightIconNode.style.display = "inline";
				}
				this.deletepressed=0;

			}
			return;
		},
		//END deleteserverprep
		
		//BEGIN deleteserver
		deleteserver : function() {	
			//Take items out of array
			this.myservers.splice(this.currentservernum,1);
			
			dojo.byId("selectbox").remove(this.currentservernum);

			dojo.destroy(this.theSelect);
			this.theSelect2.destroyRecursive();

			this.uiSetup();
			this.deletepressed=0;
			this.deleteserverprep();

//	this.updateUserandPass(document.getElementById("selectbox").selectedIndex);
//	this.selectserver(document.getElementById("selectbox").selectedIndex);
	
			this.saveToLocalStorage();
		},
		//END DELETE SERVER

		//BEGIN saveserver
		saveserver: 	function()
		{
			
		//Add to myservers
		this.myservers[this.currentservernum].url=dojo.byId("editservername").value	
		this.myservers[this.currentservernum].city=dojo.byId("editcity").value
		this.myservers[this.currentservernum].username=dojo.byId("editusername").value
		this.myservers[this.currentservernum].password=dojo.byId("editpassword").value

		//Write this to localStorage....
		this.saveToLocalStorage();

		//Change in edit servers
		//dijit.byId('servernum' + clickedservernum).set("label",myservers[clickedservernum].url);
		dojo.byId("selectbox").options[this.currentservernum].innerHTML=this.myservers[this.currentservernum].url;
		//document.getElementById("serverlist").options[document.getElementById("selectbox").selectedIndex].innerHTML=myservers[document.getElementById("selectbox").selectedIndex].url;
		
		dijit.byId('list2_itemnum_' + this.currentservernum).set("label", this.myservers[this.currentservernum].url);

		}, //End of saveserver
		
		//BEGIN loadSitRepFrame
		loadSitRepFrame: function() {
			console.log("Login_mobile: loadSitRepFrame");
			dojo.create("iframe", {
		    "src": "main_frame.html",
		    "style": "border: 0; width: 100%; height: 100%"
			}, dojo.byId("main_frame_view") );  
			var w = dijit.byId('root_view');
			w.performTransition('main_frame_view',1,"fade",null);
		}
		//END loadSitRepFrame

	
	



	} );
} );




	
