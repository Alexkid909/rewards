var model = {
	mode: {
		parentMode: false,
		pin: parseInt(localStorage.getItem('pin')) || 1234,
		saveParentPin: function() {
			localStorage.setItem('pin',this.pin)
		},
		currentSection: undefined
	},
	messages: {
		enterPin: 'Please enter the parent pin',
		enterNewPin: 'Please enter a new parent pin',
		confirmNewPin: 'Please confirm the new parent pin by re-entering it',
		incorrectPin: "Sorry that isn't the correct PIN",
		newPinMismatch: "Sorry the pins that you entered did not match, Please try again.",
		pinChanged: "The parent pin has been changed",
		taskDoneConfirmation: "Great work competing a task!",
		noItemsToShow: function(itemType) {
			return `You have no ${itemType}s, please add some!`;
		},
		confirmDelete: function(itemType) {
			return "Are you sure you want to delete this "+itemType+"?"
		},
		alertTooFewPoints: function(rewardValue,totalPoints) {
			return "Sorry you dont have enough points to claim this reward. You need "+(rewardValue-totalPoints)+" more points."
		},
		validationEmptyField: function(fieldContent) {
			return "Please enter a valid "+fieldContent+"."
		} 
	},
	taskList: {
		tasks: JSON.parse(localStorage.getItem('taskList')) || [],
		saveTasks: function() {
			localStorage.setItem('taskList',JSON.stringify(this.tasks));
		},
		addTask: function(description,imgSrcUrl) {
			
			if (!imgSrcUrl) {
				var imgSrcUrl = "images/general-task.png";
			};
			this.tasks.push(
				{
					title: description,
					value: 1,
					claimed: false,
					imgSrcUrl: imgSrcUrl
				}
			);		
		},
		editTask: function(taskID,editedField,newValue) {
			
			this.tasks[taskID][editedField] = newValue;
		},
		toggleTaskClaimed: function(taskID) {
			var taskClaimedStatus = this.tasks[taskID].claimed;
			this.tasks[taskID].claimed = !taskClaimedStatus;
		},
		aproveAllClaimedTasks: function() {
			var total = model.points.total;
			this.tasks.forEach(function(task) {
				taskClaimed = task.claimed
				if (task.claimed) {
					total +=task.value;
					task.claimed = !taskClaimed;
				}
			model.points.total = total;
			});
		},	
	},
	claimedTasks: {
		tasks: JSON.parse(localStorage.getItem('claimedTasks')) || [],
		saveTasks: function() {
			localStorage.setItem('claimedTasks',JSON.stringify(this.tasks));
		},
		rejectClaimedTask: function(taskID) {
			var taskRejected = this.tasks[taskID].rejected;
			this.tasks[taskID].rejected = !taskRejected;
		},			
	},
	points: {
		total: parseInt(localStorage.getItem('points')) || 0,
		savePoints: function() {
			localStorage.setItem('points',this.total)
		}
	},
	rewardList: {
		rewards: JSON.parse(localStorage.getItem('rewardList')) || [],
		saveRewards: function() {
			localStorage.setItem('rewardList',JSON.stringify(this.rewards));
		},
		displayRewards: function() {
			if (this.rewards.length < 1) {
				console.log("No rewards have been created yet.");
			} else {
				console.table(this.rewards);
			}
		},
		addReward: function(title,value,imgSrcUrl) {
			if (!imgSrcUrl) {
				var imgSrcUrl = "images/general-reward.png";
			};

			if (!value) {
				var value = 1;
			};

			this.rewards.push(
				{
					title: title,
					value: value,
					imgSrcUrl: imgSrcUrl
				}
			);			
		},
		editReward: function(rewardID,editedField,newValue) {
			this.rewards[rewardID][editedField] = newValue;
		},
		claimReward: function(rewardID) {
			var claimedReward = {
				title: this.rewards[rewardID].title,
				dateClaimed: new Date().toLocaleString(),
				rejected: false,
				aproved: false,
				id: model.claimedRewards.rewards.length,
				value: this.rewards[rewardID].value
			}
			model.claimedRewards.rewards.push(claimedReward);
		}			
	},
	claimedRewards: {
		rewards: JSON.parse(localStorage.getItem('claimedRewards')) || [],
		saveRewards: function() {
			localStorage.setItem('claimedRewards',JSON.stringify(this.rewards));
		}
	},
	generalMethods: {
		deleteItem: function(itemType,itemID) {
			var itemObj = itemType+"List"
			var itemObjDataArray = itemType+"s"; 
			model[itemObj][itemObjDataArray].splice(itemID,1);
		},
		saveItems: function(itemType) {
			localStorage.setItem(itemType+'List',JSON.stringify(model[itemType+'List'][itemType+'s']));
		},
		editItem: function(itemType,itemID,editedField,newValue) {
			itemID = itemID.replace("task","").replace("reward","");
			var itemObj = itemType+"List";
			var itemObjDataArray = itemType+"s";
			model[itemObj][itemObjDataArray][itemID][editedField] = newValue; 
		},
		displayValidationMessage: function(field) {

		}

	}
};