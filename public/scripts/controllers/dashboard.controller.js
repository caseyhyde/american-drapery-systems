app.controller('DashboardController', ['UserFactory', '$http', function(UserFactory, $http) {
  const self = this;
  var currentUser = {};

  self.logIn = function() {
    console.log("Login clicked, running logIn fxn in dashboard controller");
    UserFactory.logIn().then(function() {
      console.log('test');
      if(currentUser) {
        getSurveys();
      }
    });
  };

  self.logOut = function() {
    console.log("Logout clicked, running logOut fxn in dashboard controller");
    UserFactory.logOut();
    currentUser = {};
  };
  self.filtered = [];
  var surveyList = [];

  self.show = {
    completed: true,
    declined: false,
    compare: function (status) {
      var compBool = (!this.completed && (status == "Completed"));
      var decBool = (!this.declined && (status == "Declined"));
      return compBool || decBool;
    }
  }

  function getSurveys(){
    currentUser = UserFactory.getUser();
    console.log('getting surveys - currentUser:', currentUser);
    currentUser.user.getToken().then(function(idToken) {
      $http({
        method: 'GET',
        url: '/surveys/all',
        headers: {
          id_token: idToken
        }
      }).then(function(response){
        console.log('success');
        surveyList = formatData(response.data);
        self.filter(self.show);
      });
    });
  }

  function formatData(surveys){
    console.log(surveys);
    for (var i = 0; i < surveys.length; i++) {
      surveys[i].last_modified = moment(surveys[i].last_modified).format("YYYY/MM/DD");
      surveys[i].survey_date = moment(surveys[i].survey_date).format("YYYY/MM/DD");
    }
    return surveys;
  }

  self.filter = function(show) {
    self.filtered = [];
    for (var i = 0; i < surveyList.length; i++) {
      if(!show.compare(surveyList[i].status)) {
        self.filtered.push(surveyList[i]);
      }
    }
  }

}]);
