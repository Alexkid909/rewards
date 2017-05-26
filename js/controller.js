var controller = {
	variables: {
		
	},
	addTaskHandler: function(e) {
		var predefinedTaskGroup = e.target.getParentOfClassName('add-predefined-task')
		if(predefinedTaskGroup) {
			var imgSrcUrl = predefinedTaskGroup.querySelector('.img-task-control').attributes.src.nodeValue;
			var description = predefinedTaskGroup.querySelector('h3').textContent;
			var imgContainer = predefinedTaskGroup.querySelector('.img-task-control-wrapper');
			view.highlightItem(imgContainer,150);
			view.hopItem(imgContainer);
			model.taskList.addTask(description,imgSrcUrl);
			view.playItemAddedAudio();
		}
		controller.validation.validateField(e.target)
		if(e.key == "Enter") {
			var itemType = e.target.dataset.itemType	
			if (controller.validation.validate(e.target)) {
				model.taskList.addTask(addTask_TaskTitleInput.value);
				addTask_TaskTitleInput.value = "";
				window.setTimeout(function() {addTask_TaskTitleInput.focus()},0);
				view.playItemAddedAudio();
			};
		};
		if(e.key == "Enter" || predefinedTaskGroup) {
				model.taskList.saveTasks();
				view.displayTaskList();
		}			
	},
	claimTaskDoneHandler: function(taskClaimed) {
		var taskClaimedID = taskClaimed.replace("task","")
		model.taskList.toggleTaskClaimed(taskClaimedID);
		model.claimedTasks.saveTasks();	
		view.toggleTaskClaimedVisuals(taskClaimedID,model.taskList.tasks[taskClaimedID].claimed);
		model.taskList.saveTasks();
		view.playTaskClaimedAudio(model.taskList.tasks[taskClaimedID].claimed);
	},
	editItemHandler: function(e) {
		if (e.key == "Enter") {
			
			var editedField = e.target;
			if (this.validation.validate(e.target)) {
				var newValue = e.target.value;
				var itemType = e.target.getParentOfTagName('fieldset').dataset.itemType;
				var itemTypeProper = itemType.replace(/\w\S*/g,function(text) {return text.charAt(0).toUpperCase()+text.substring(1)});
				var itemID = e.target.getParentOfTagName("li").dataset.itemId;
				model.generalMethods.editItem(itemType,itemID,editedField.dataset.itemField,newValue);
				e.target.disabled = true;			
				model.generalMethods.saveItems(itemType);
				view['display'+itemTypeProper+'List']();
				view.displayHideParentModeLements()
			} else {
				editedField.focus();
			};	
		}
	},
	validation: {
		validate: function(field) {	
			var validationPassed = true;
			var formGroup = field.getParentOfClassName('form-group');
			var validationType;
			var validationElement;
			if(formGroup) {
				validationType = 'FormGroup';
				validationElement = formGroup;
			} else {
				validationType = 'Field';
				validationElement = field;
			}
			validationPassed = this["validate"+validationType](validationElement);
			return validationPassed;
		},
		validateField: function(field) {
			var field = field;
			var validationCheck = () => !field.value ? false : true;
			var validationPassed = validationCheck(); 
			view.fieldValidationMessaging(field,validationPassed);
			return validationPassed;
		},
		validateFormGroup: function(formGroup) {
			var fieldsToValidate = Array.from(formGroup.querySelectorAll('input'));	
			fieldsToValidate.forEach(field => this.validateField(field))
			validationPassed = fieldsToValidate.every(field => this.validateField(field))
			return validationPassed		
		}
	},
	toggleInputEditableHandler: function(e) {
		if (model.mode.parentMode && listInputs) {
			listInputs.forEach(input => {
				input.disabled = true;
				if(input.dataset.itemFieldtype == "list_input" && !input.value) {
					var itemType = input.getParentOfTagName('fieldset').dataset.itemType;
					var itemID = input.getParentOfTagName('li').id;
					var itemValue = model[`${itemType}List`][`${itemType}s`][itemID].title;
					input.value = itemValue;
					this.validation.validateField(input);
				}
			});
			e.target.disabled = false;
			e.target.focus();
		};
	},
	rejectClaimedTaskHandler: function(taskRejected) {
		model.claimedTasks.rejectClaimedTask(taskRejected);
		model.claimedTasks.saveTasks();	
		view.displayClaimedTasks();		
	},
	approveAllClaimedTasksHandler: function(e) {
		e.preventDefault();		
		model.taskList.aproveAllClaimedTasks()
		model.taskList.saveTasks();
		model.points.savePoints();
		view.displayRewardPointsTotal();
		view.displayTaskList();
	},
	addRewardHandler: function(e) {
		var predefinedRewardGroup = e.target.getParentOfClassName('add-predefined-reward')
		if(predefinedRewardGroup) {
			var imgSrcUrl = predefinedRewardGroup.querySelector('.img-reward-control').attributes.src.nodeValue;
			var description = predefinedRewardGroup.querySelector('h3').textContent;
			var imgContainer = predefinedRewardGroup.querySelector('.img-reward-control-wrapper');
			view.highlightItem(imgContainer,200);
			view.hopItem(imgContainer);
			model.rewardList.addReward(description,1,imgSrcUrl);
			view.playItemAddedAudio();
		}
		controller.validation.validateField(e.target);
		if(e.key == "Enter") {
			var itemType = e.target.dataset.itemType	
			if (controller.validation.validate(e.target)) {
				model.rewardList.addReward(addReward_TitleInput.value,addReward_ValueInput.value);
				addReward_TitleInput.value = "";
				addReward_ValueInput.value = "";				
				window.setTimeout(function() {addReward_TitleInput.focus()},0);
				model.rewardList.saveRewards();
				view.displayRewardList();
			};
		};

		if(e.key == "Enter" || predefinedRewardGroup) {
			model.rewardList.saveRewards();
			view.displayRewardList();
		};
	},
	deleteItemHandler: function(e) {
		var parentItem = e.target.getParentOfTagName("fieldset"); 
		var itemType = parentItem.dataset.itemType
		var itemID = parentItem.id;
		var deleteConfirmed = window.confirm(model.messages.confirmDelete(itemType));
		if(deleteConfirmed) {
			model.generalMethods.deleteItem(itemType,itemID);
			model.generalMethods.saveItems(itemType);
			var itemTypeProper = itemType.replace(/\w\S*/g,function(text) {return text.charAt(0).toUpperCase()+text.substring(1)});
			view['display'+itemTypeProper+'List']();
		};
	},
	claimRewardHandler: function(e) {
		var rewardClaimedLi = e.target.getParentOfTagName('li');
		var rewardClaimedFieldset = e.target.getParentOfTagName('fieldset');
		var rewardClaimed =	rewardClaimedLi.dataset.itemId.replace("reward","");
		var rewardValue = model.rewardList.rewards[rewardClaimed].value;
		var totalPoints = model.points.total;
		if(rewardValue > totalPoints) {
			rewardClaimedFieldset.addEventListener('animationend',function() {
				rewardClaimedFieldset.classList.remove('shake');
			})
			rewardClaimedFieldset.classList.add('shake');
			view.playRewardClaimedFail();
		} else {
			rewardClaimedFieldset.addEventListener('animationend',function() {
				rewardClaimedFieldset.classList.remove('popout');
			})
			rewardClaimedLi.classList.add('popout');
			view.highlightItem(rewardClaimedFieldset);
			view.popItem(rewardClaimedFieldset);
			view.playRewardClaimedAudio();
			model.rewardList.claimReward(rewardClaimed);
			model.points.total -= rewardValue;
			model.claimedRewards.saveRewards();
			model.points.savePoints()
			view.displayClaimedRewards();
			view.displayRewardPointsTotal();
		}
	},
	toggleParentModeHandler: function(e) {
		e.preventDefault();
		var messages = model.messages;
		parentMode = model.mode.parentMode;
		if(!parentMode) {
			var enteredPin = window.prompt(messages.enterPin);
			if (enteredPin == model.mode.pin) {
				model.mode.parentMode = !parentMode;
			} else {
				window.alert(messages.incorrectPin);
			};
		} else {
			model.mode.parentMode = !parentMode;						
		};
		view.displayHideParentModeLements();	
	},
	changeParentModePin: function() {
		var messages = model.messages;
		var enteredPin = window.prompt(messages.enterPin);
		if (enteredPin == model.mode.pin) {
			var newPin = window.prompt(messages.enterNewPin);
			var newPinConf = window.prompt(messages.confirmNewPin);
			if(newPin == newPinConf) {
				model.mode.pin = parseInt(newPin);
				model.mode.saveParentPin();
				window.alert(messages.pinChanged);
			} else {
				window.alert(messages.alertPinMismatch);
			}
		} else {
			window.alert(messages.incorrectPin);
		};				
	}

};