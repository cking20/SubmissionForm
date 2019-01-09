var statesJSON = [
	{"value": "AL","name": "Alabama"},
	{"value": "AK","name": "Alaska"},
	{"value": "AZ","name": "Arizona"},
	{"value": "AR","name": "Arkansas"},
	{"value": "CA","name": "California"},
	{"value": "CO","name": "Colorado"},
	{"value": "CT","name": "Connecticut"},
	{"value": "DE","name": "Delaware"},
	{"value": "DC","name": "District Of Columbia"},
	{"value": "FL","name": "Florida"},
	{"value": "GA","name": "Georgia"},
	{"value": "HI","name": "Hawaii"},
	{"value": "ID","name": "Idaho"},
	{"value": "IL","name": "Illinois"},
	{"value": "IN","name": "Indiana"},
	{"value": "IA","name": "Iowa"},
	{"value": "KS","name": "Kansas"},
	{"value": "KY","name": "Kentucky"},
	{"value": "LA","name": "Louisiana"},
	{"value": "ME","name": "Maine"},
	{"value": "MD","name": "Maryland"},
	{"value": "MA","name": "Massachusetts"},
	{"value": "MI","name": "Michigan"},
	{"value": "MN","name": "Minnesota"},
	{"value": "MS","name": "Mississippi"},
	{"value": "MO","name": "Missouri"},
	{"value": "MT","name": "Montana"},
	{"value": "NE","name": "Nebraska"},
	{"value": "NV","name": "Nevada"},
	{"value": "NH","name": "New Hampshire"},
	{"value": "NJ","name": "New Jersey"},
	{"value": "NM","name": "New Mexico"},
	{"value": "NY","name": "New York"},
	{"value": "NC","name": "North Carolina"},
	{"value": "ND","name": "North Dakota"},
	{"value": "OH","name": "Ohio"},
	{"value": "OK","name": "Oklahoma"},
	{"value": "OR","name": "Oregon"},
	{"value": "PA","name": "Pennsylvania"},
	{"value": "RI","name": "Rhode Island"},
	{"value": "SC","name": "South Carolina"},
	{"value": "SD","name": "South Dakota"},
	{"value": "TN","name": "Tennessee"},
	{"value": "TX","name": "Texas"},
	{"value": "UT","name": "Utah"},
	{"value": "VT","name": "Vermont"},
	{"value": "VA","name": "Virginia"},
	{"value": "WA","name": "Washington"},
	{"value": "WV","name": "West Virginia"},
	{"value": "WI","name": "Wisconsin"},
	{"value": "WY","name": "Wyoming"}
];

/*
Description: Applies listeners to form, populates select with options
*/
$(document).ready(function(){
	//add submit listener to the form
	$('form#employeeSubmission').submit(function(event){
		event.preventDefault();
		event.stopPropagation();
		submitEmployee();
	});
	//trim the inputs when they are changed
	$('input[type="text"]').change(function(){
		this.value = $.trim(this.value);
		this.value = this.value.replace(/\s\s+/g, ' ');
	});
	//auto format the telephone input
	formatTelephone();
	//add all states as select options
	appendStates();
});

/*
Preconditions: assumes document ready
Postconditions: the select with ID of stateDropdown 
	will have all US states appended as options
*/
function appendStates(){
	var states = $("select#stateDropdown");
	states.append('<option value= "">Choose Your State</option>');

	$.each(statesJSON, function(key, entry){
		states.append($('<option></option>')
			.attr('value', entry.value).text(entry.name));
	});	
};

/*
Description: removes non phone number characters
	if it has the required number of digits or more, the '-'s are inserted
	the number is truncated to be no longer than the required amount
Postcondition: phone number value is mutated. 
*/
function formatTelephone(){
	$('input[type="tel"]').change(function(){
		var phoneNumber = $.trim(this.value);
		//remove all non numeric characters
		phoneNumber = phoneNumber.replace(/\D/g, "");

		if(phoneNumber.length < 10){//is not a phone number
			//warning is already handled by required pattern
		}else if(phoneNumber.length >= 10){//it has enough digits to be a phone number
			//add the '-'s for the user
			phoneNumber = [phoneNumber.slice(0,3),'-',phoneNumber.slice(3,6),'-',phoneNumber.slice(6,10)].join('');
		}
		this.value = phoneNumber;
	});
}

/*
Description: Send employee data to server if it passes validation
Assumption: input elements have performed low level checks against bad data
*/
function submitEmployee(){
	var employee = {
		//provide the form ID so jQuery doesnt have to traverse the entire dom
		name: $("#employeeSubmission input[name=employeeName]").val(),
		number: $("#employeeSubmission input[name=employeeNumber]").val(),
		phone: $("#employeeSubmission input[name=phoneNumber]").val(),
		address: $("#employeeSubmission input[name=address]").val(),
		city: $("#employeeSubmission input[name=city]").val(),
		state: $("#employeeSubmission select[name=state]").val(),
		zip: $("#employeeSubmission input[name=zip]").val(),
		isEmployee: $("#employeeSubmission input[name=isCurrentEmployee]").is(":checked"),
	}

	//Just so we can see the data being sent
	console.log(JSON.stringify(employee));

	if(verifyEmployeeData(employee)){
		$.ajax({
			url: 'https://localhost:8080/post',
			type: 'post',
			dataType: 'json',
			contentType: 'application/json',
			data: JSON.stringify(employee),
			success: function (data, status, jqXHR) {
				$("#container").html(data);
				alert("Successfully submitted employee data.");
			},
			error: function (jqXHR, status, err) {
				alert("Failed to submit data. \nError " + jqXHR.responseText);
			},
			complete: function (jqXHR, status) {
				//no action required
			}
		});
	}else{
		alert("The data you entered is not valid.");
	}
};

/*
Description: perform higher level verification than what the input fields allow for
*/
function verifyEmployeeData(data){
	var validFlag = true;
	//there are no such checks in the specification.
	return validFlag;
}