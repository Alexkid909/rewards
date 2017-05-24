var view = {
	sectionOnDisplay: 2,
	displayTaskList: function() {
		var taskListHTML = model.taskList.tasks.map((task,position) => {
			var claimedClass = task.claimed ? "animate-done" : ""; 
			return `<li data-item-id="task${position}" class="col-sm-4 list-col">
				<fieldset data-item-type="task">
					<input type="text" class="list_input title" data-item-field="title" data-item-fieldType="list_input" value="${task.title}" onkeypress="controller.editItemHandler(event)" disabled>
					<div class="img-container">
						<img class="img-task doneButton" src="${task.imgSrcUrl}">
						<img class="doneImage ${claimedClass}" src="images/star.png">
						<img class="img-cross deleteButton parent-mode-element"" src="images/cross.png">
					</div>
				</fieldset>
			</li>`;
		})
		.join('');
		taskListUl.innerHTML = taskListHTML;
		var message = () => !Object.keys(model.taskList.tasks).length ? model.messages.noItemsToShow("task") : "";
		// this.displayMessage(message())
		view.setImgContainerHeight(imageContainerGroups)		
	},
	displayMessage: function(message) {
		var messageFilter = document.querySelector('.message-filter');
		var messageHeader = messageFilter.querySelector('h5');
		messageHeader.textContent = message;
		!message ? messageFilter.classList.remove('visible') : messageFilter.classList.add('visible') ;		
	},
	displayRewardList: function() {
		var data = model.rewardList.rewards;
		var rewardListHTML = data.map((reward,position) => 
			`<li data-item-id="reward${position}" class="col-sm-4">
				<fieldset data-item-type="reward">
					<input type="text" class="list_input title" data-item-field="title" data-item-fieldType="list_input" value="${reward.title}" onkeypress="controller.editItemHandler(event)" disabled>
					<div class="img-container claimButton">
						<img class="img-reward doneButton" src="${reward.imgSrcUrl}">					
						<input type="number" class="value list_input" data-item-field="value" data-item-fieldType="list_input" value="${reward.value}" onkeypress="controller.editItemHandler(event)" disabled>
						<img class="img-cross deleteButton parent-mode-element"" src="images/cross.png">
					</div>
				</fieldset>
			</li>`).join('');
		rewardListUl.innerHTML = rewardListHTML;
		
		var message = () => !Object.keys(data).length ? model.messages.noItemsToShow("reward") : "";
		// this.displayMessage(message());
		view.setImgContainerHeight(imageContainerGroups)			
	},
	toggleTaskClaimedVisuals: function(taskID,taskClaimedStatus) {
		var taskLi = taskList.querySelector(`li[data-item-id=task${taskID}`);
		var doneImage = taskLi.querySelector('.doneImage')
		taskClaimedStatus ? doneImage.classList.add('animate-done') : doneImage.classList.remove('animate-done');	
	},
	playTaskClaimedAudio: function(taskClaimedStatus) {
		if(taskClaimedStatus) {
			cheer.currentTime = 0;
			cheer.play()
		};
	},
	playItemAddedAudio: function() {
		pop.currentTime = 0;
		pop.play()
	},
	playRewardClaimedAudio: function() {
		woohoo.currentTime = 0;
		woohoo.play();
	},
	playRewardClaimedFail: function() {
		uhoh.currentTime = 0;
		uhoh.play();		
	},
	displayRewardPointsTotal: function() {
		pointsTotal.textContent = model.points.total;
	},
	highlightItem: function(element,duration) {
		
		if(!duration) {duration = 500}; 
		element.style.transition = `background-color ${duration}ms ease-in`;
		element.addEventListener('transitionend',function(e) {
			e.target.classList.remove('bg-yellow')})
		element.classList.add('bg-yellow');
	},
	popItem: function(element) {
		element.addEventListener('animationend',function(e) {
			e.target.classList.remove('popout')})
		element.classList.add('popout');
	},
	hopItem: function(element) {
		element.addEventListener('animationend',function(e) {
			e.target.classList.remove('hop')})
		element.classList.add('hop');
	},	
	displayClaimedRewards: function() {
		var claimedRewardsHTML = model.claimedRewards.rewards.map(function(reward) {
				var position = position;
				function setLiClass(reward) {	
					if(reward.rejected) {return "rejected"} else {return ""};
				};
				var liClass = setLiClass(reward);
				function setRejectButtonText(reward) {
					if(reward.rejected) {return "Undo"} else {return "Reject"};
				};
				var rejectButtonText = setRejectButtonText(reward);
				return `<li class="${liClass}" data-item-id="${reward.id}"><span class="reward-title">${reward.title}</span><span class="claimed-date">${reward.dateClaimed}</span><button class="rejectButton">${rejectButtonText}</button></li>`});
		var claimedRewardsHTML = claimedRewardsHTML.join('');
		claimedRewardsUl.innerHTML = claimedRewardsHTML;
	},
	fieldValidation: function(element) {
		fields = Array.from(element.parentNode.querySelectorAll('input'));
		fields.some(function(field) {
			if(field.value) {
				return true
			} else {
				field.parentNode.querySelector('.validation').classList.toggle('validation');
				return false
			}
		});
	},
	displayHideParentModeLements: function() {
		parentModeElements = document.querySelectorAll('.parent-mode-element');
		const toggleParentModeControl = document.querySelector('.nav .nav-pull-right .toggle_parent_mode');
		if (!model.mode.parentMode) {		
			parentModeElements.forEach(element => element.classList.add('hidden'));
			toggleParentModeControl.classList.remove('active');
		} else {
			parentModeElements.forEach(element => element.classList.remove('hidden'));
			toggleParentModeControl.classList.add('active');
		}		
	},
	fieldValidationMessaging: function(field,validationPassed) {
		
		var action;
		var itemType = () => field.dataset.itemType ? field.dataset.itemType : field.getParentOfTagName("fieldset").dataset.itemType; 
		var validationMessage;
		function show() {
			action = "add";
			validationMessage = function() {
				if(field.dataset.itemFieldtype == "control_input") {
					return `Please enter a ${itemType()} ${field.dataset.itemField}`
				} else {
					return `Enter a ${itemType()} ${field.dataset.itemField} here`
				};
			};	
		}
		function hide() {
			action = "remove";
			validationMessage = function() {
				if(field.dataset.itemFieldtype == "control_input") {
					return `${field.dataset.defaultPlaceholder}`
				} else {
					return ""
				};
			};	
		}
		!validationPassed ? show() : hide();
		field.classList[action]('error');
		field.placeholder = validationMessage(); 	
	},
	displayFormGroupValidationMessaging: function() {

	},
	alertTooFewPoints: function(rewardValue,totalPoints) {
		window.alert("Sorry you dont have enough points to claim this reward. You need "+(rewardValue-totalPoints)+" more points.");
	},
	slideToSection: function(e,sectionNum) {
		if(e) {
			e.preventDefault();
		};
		const sections = sectionContainer.querySelectorAll('.section:not(.hidden)');
		const percentagePerSection = 100 / sections.length;
		const translateXPercentage = "translateX(-"+(sectionNum)*percentagePerSection+"%)";
		document.documentElement.style.setProperty("--sliderTranslateX",translateXPercentage);		
	},
	transitionPresetsHandler: function(target,direction) {
		var operator;

		var presetItems = target.getParentOfTagName("fieldset").querySelector('.col-container .row');
		var currentTransition = presetItems.style.transform;
		!currentTransition ? currentTransition = 0 : currentTransition = presetItems.style.transform.replace("translateX(","").replace("%)","");
		var newTranslateX = function() {
			return parseFloat(currentTransition) + parseFloat(operator+25)+"%";
		}
		var newTranslateX;
		switch (direction) {
			case "left":
				operator = "-";
				if (currentTransition >= -12.5*3) {
					presetItems.style.transform = `translateX(${newTranslateX()})`;
				};
				break;
			case "right":
				operator = "+";
				if (currentTransition < 0) {
					presetItems.style.transform = `translateX(${newTranslateX()})`;
				};
				break;
		} 
	},
	setupEventListeners: function() {
		lists.forEach(list => list.addEventListener('click', function(e) {
				if (e.target.localName == "input") {
					controller.toggleInputEditableHandler(e);
				} else if (e.target.classList.contains("deleteButton")) {
					controller.deleteItemHandler(e);
				}
			})
		);
		taskListUl.addEventListener('click',function(e) {
			var targetClassList = e.target.classList;
			if (targetClassList.contains("doneButton") || targetClassList.contains("doneImage")) {
				controller.claimTaskDoneHandler(e.target.getParentOfTagName('li').dataset.itemId);
			} 
		});
		claimedTasksUl.addEventListener('click',function(e) {
			if (e.target.className == "rejectButton") {
				controller.rejectClaimedTaskHandler(e.target.parentNode.id);	
			};
		});
		rewardListUl.addEventListener('click', function(e) {
			
			if (e.target.classList.contains("doneButton")) {
				controller.claimRewardHandler(e);
			};
		});
		document.addEventListener('click', function(e) {
			if(e.target.dataset.itemFieldtype != "list_input") {
				listInputs.forEach(listInput => {
					listInput.disabled = "true";
					var itemType = listInput.getParentOfTagName('fieldset').dataset.itemType;
					var itemID = listInput.getParentOfTagName('li').dataset.itemId.replace(itemType,"");
					var fieldType = listInput.dataset.itemField;
					listInput.value = model[`${itemType}List`][`${itemType}s`][itemID][`${fieldType}`];
					 
					view.fieldValidationMessaging(listInput,true);
				});
			};
			if(e.target.dataset.itemFieldtype != "control_input") {
				controlInputs.forEach(controlInput => view.fieldValidationMessaging(controlInput,true));
			};
		});
		window.addEventListener('resize',function(e) {
			view.setImgContainerHeight(imageContainerGroups);
		});	
	},
	setImgContainerHeight: function(imgContainerGroups) {
		imgContainerGroups.forEach(function(imgContainerGroup) {
			var instance = 0;
			var setImgConHeight = setInterval(function() {
			imgContainer = imgContainerGroup.element.querySelector('.img-container');
				if(imgContainer) {
					containerWidth = imgContainer.clientWidth+1+"px";
					document.documentElement.style.setProperty(imgContainerGroup.cssHeightVariable,containerWidth)
				};
				instance++;  
				if (instance > 99) {
					clearInterval(setImgConHeight)
				}
			},10);
		});
	}
};

const app = document.querySelector('.app');
const lists = document.querySelectorAll('div[class*="_list"] ul');
const taskList = document.querySelector('.task_list');
const taskListControls = taskList.querySelector('.list_controls');
const addTask_TaskTitleInput = taskListControls.querySelector("div.task_list div.list_controls input[data-item-field=title]");
const taskListUl = taskList.querySelector('ul');
const claimedTasks = document.querySelector('.claimed_tasks');
const claimedTasksUl = claimedTasks.querySelector('ul');
const rewardList = document.querySelector('.reward_list');
const rewardListControls = rewardList.querySelector("div.list_controls");
const addReward_TitleInput = rewardListControls.querySelector("input[data-item-field=title]");
const addReward_ValueInput = rewardListControls.querySelector("input[data-item-field=value]");
const rewardListUl = rewardList.querySelector('ul');
const pointsTotal = document.querySelector('.points_total_container .points_total');
const claimedRewards = document.querySelector('.claimed_rewards');
const claimedRewardsUl = claimedRewards.querySelector('ul');
const sectionContainer = document.querySelector('.section-view:not(.titles) .section-container');
const controlInputs = document.querySelectorAll(".list input[data-item-fieldtype=control_input]");
const cheer = document.querySelector('audio.cheer');
const woohoo = document.querySelector('audio.woohoo');
const uhoh = document.querySelector('audio.uhoh');
const pop = document.querySelector('audio.pop');
var parentModeElements;
const imageContainerGroups = [
		{
			element:taskListControls,
			cssHeightVariable: "--taskListControlsImgContainerHeight"
		},
		{
			element: taskListUl,
			cssHeightVariable: "--taskListImgContainerHeight"
		},
		{
			element: rewardListUl,
			cssHeightVariable: "--rewardListImgContainerHeight"	
		}
	];


model.mode.parentMode = true;
view.displayTaskList();
view.displayRewardList();

var allInputs = app.querySelectorAll('input');
var listInputs = app.querySelectorAll('input[data-item-fieldtype=list_input]');
var imgContainer;

// view.displayClaimedTasks();
// view.displayClaimedRewards();
view.displayRewardPointsTotal();
view.displayHideParentModeLements();
view.setupEventListeners();
view.slideToSection(undefined,0);


HTMLElement.prototype.getParentOfTagName = function(name) {
	el = this;
    do el = el.parentNode;
    while (el.localName != name)
    return el
};

HTMLElement.prototype.getParentOfClassName = function(name) {
	el = this;
    do {
    	el = el.parentNode;
    	if (!("classList" in el)) {
    		return undefined;
    	};
    }
    while (!el.classList.contains(name));
    return el;
};

HTMLElement.prototype.getParentOfDataAttriute = function(dataAttributeName,dataAttributeValue) {
	el = this;
    do el = el.parentNode;
    while (!el.dataSet.contains(name))
    return el
};