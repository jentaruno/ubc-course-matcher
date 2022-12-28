import React, { Component } from 'react';

class CourseMatcher extends Component {

  state = {
    errorMessage: "",
    timetablesText: [<tr>
      <td><input type="text" className="form-control" placeholder="Your name"></input></td>
      <td><input type="file" accept=".ics" className="form-control" onChange={(e) => this.handleUpload(e)}></input></td>
      <td></td>
    </tr>,
    <tr>
      <td><input type="text" className="form-control" placeholder="Friend's name"></input></td>
      <td><input type="file" accept=".ics" className="form-control" onChange={(e) => this.handleUpload(e)}></input></td>
      <td></td>
    </tr>],
    courses: [],       //Courses reading array. Will have courseList, file, student
    submitted: false,
    tableTitleText: "",
    tableHead1Text: "",
    tableHead2Text: "",
    tableText: <tr><td colSpan="2" className='table-secondary help-text text-muted  text-center'><em><small>
      After uploading your files, click Submit and press one of the three buttons above. The information you need will be displayed here.
    </small></em></td></tr>
  }

  //------------Timetable table functions

  addField = (e) => {
    e.preventDefault();
    let newTimetablesText = this.state.timetablesText;
    newTimetablesText.push(<tr>
      <td><input type="text" className="form-control" placeholder="Friend's name"></input></td>
      <td><input type="file" accept=".ics" className="form-control" onChange={(e) => this.handleUpload(e)}></input></td>
      <td><button className="btn btn-outline-danger deleteBtn" onClick={(e) => this.handleDeleteRow(e)}>X</button></td>
    </tr>);
    this.setState(prevState => ({
      timetablesText: newTimetablesText
    }));
  }

  handleDeleteRow = (e) => {
    let currentRow = e.target.closest("tr");
    let newCourses = this.state.courses;
    newCourses.splice(currentRow.rowIndex - 1, 1);
    this.setState(prevState => ({
      courses: newCourses,
      submitted: false
    }))
    currentRow.remove();;
  }

  //------------Upload and submit button functions

  handleUpload = (e) => {
    this.setState(prevState => ({
      submitted: false
    }))

    if (e.target.files.length == 0)
      return;

    let newCourses = this.state.courses;
    let file = e.target.files[0];
    let reader = new FileReader();
    reader.readAsText(file);
    reader.onload = function () {
      let currentRow = e.target.closest("tr").rowIndex - 1;
      newCourses[currentRow] = { file: reader.result };
    };

    reader.onerror = function () {
      console.log(reader.error);
    };

    this.setState(prevState => ({
      courses: newCourses
    }));

  }

  handleSubmit = () => {
    if (this.isTableValid()) {
      this.setState(prevState => ({ submitted: true }));
    }
    else {
      this.setState(prevState => ({ submitted: false }));
    }
    //Read courses one by one
    let extractedCourses = this.state.courses.map(e => e.file.split('\n'))
      .map(e =>
        e.filter(e => e.includes("SUMMARY:"))
          .filter((v, i, a) => a.indexOf(v) === i)
          .map(e => e.substring(8, 20)));

    //Read times that student is in class
    let extractedClassStartTimes = this.state.courses.map(e => e.file.split('\n'))
      .map(e =>
        e.filter(e => e.includes("DTSTART;"))
          .filter((v, i, a) => a.indexOf(v) === i)
          .map(e => ((+e.substring(40, 42)) * 60) + (+e.substring(42, 44))));
    let extractedClassEndTimes = this.state.courses.map(e => e.file.split('\n'))
      .map(e =>
        e.filter(e => e.includes("DTEND;"))
          .filter((v, i, a) => a.indexOf(v) === i)
          .map(e => ((+e.substring(38, 40)) * 60) + (+e.substring(40, 42))));

    let extractedClassTimes = [];
    for (let i = 0; i < extractedClassStartTimes.length; i++) {
      let startend = extractedClassStartTimes[i].map(function (e, j) {
        return { start: e, end: extractedClassEndTimes[i][j] }
      });
      extractedClassTimes.push(startend);
    }

    this.setState(prevState => ({
      courses: extractedCourses.map((e, i) => Object.assign({
        key: document.getElementById("timetablesTable").rows[i].getElementsByTagName("input")[0].value,
        courseList: e,
        classTimes: extractedClassTimes[i]
      }, this.state.courses[i]))
    }));

  }

  //------------Course matching functions

  handleView = (e) => {
    e.preventDefault();
    let buttonClass = e.target.classList;
    if (buttonClass.contains("btn-courses")) {
      this.displayOnTable("courses", this.findSameCourses());
    }
    if (buttonClass.contains("btn-sections")) {
      this.displayOnTable("sections", this.findSameSections());
    }
    if (buttonClass.contains("btn-free")) {
      this.displayOnTable("free", this.findFree());
    }
  }

  isTableValid = () => {
    let timetables = document.getElementById("timetablesTable");
    let currentStudents = [];
    let currentFiles = [];

    for (let i = 0; i < timetables.rows.length; i++) {
      let currentRow = timetables.rows[i];
      let newErrorMessage = "";
      if (currentRow.getElementsByTagName('input')[1].files[0])
        var currentFile = currentRow.getElementsByTagName('input')[1].files[0].name;

      if (currentStudents.indexOf(currentRow.getElementsByTagName('input')[0].value) !== -1)
        newErrorMessage = "There are duplicate names on the table.";
      if (currentRow.getElementsByTagName('input')[1].files.length <= 0)
        newErrorMessage = "One or more files have not been uploaded.";
      if (currentRow.getElementsByTagName('input')[0].value == "")
        newErrorMessage = "One or more names have not been filled.";
      if (currentFiles.indexOf(currentFile) !== -1) {
        newErrorMessage = "There are duplicate files on the table.";
      }

      this.setState(prevState => ({
        errorMessage: newErrorMessage
      }));
      if (newErrorMessage != "") {
        return false;
      }

      currentStudents.push(currentRow.getElementsByTagName('input')[0].value);
      currentFiles.push(currentFile);
    }

    return true;
  }

  findSameCourses = () => {
    let sameCourses = []; //Same courses array. Will have courseName, courseMates
    //vvv Major loop da loop to record same sections and courses
    //Loop for each student
    for (let i = 0; i < this.state.courses.length - 1; i++) {
      //Loop for each course in this student's timetable
      for (let a = 0; a < this.state.courses[i].courseList.length; a++) {
        let currentSectionName = this.state.courses[i].courseList[a];
        let currentCourseFriends = [this.state.courses[i].key];
        //Loop for next students to check if they have the course
        for (let j = i + 1; j < this.state.courses.length; j++) {
          if (this.state.courses[j].courseList.map(e => e.substring(0, 8))
            .indexOf(currentSectionName.substring(0, 8)) >= 0)
            currentCourseFriends.push(this.state.courses[j].key);
        }
        //If there are common occurences found, add to sameCourses
        if (currentCourseFriends.length > 1 && //Check if this is not a duplicate of a previous match record
          sameCourses.map(e => { return (e.key === currentSectionName.substring(0, 8)) }).every(e => e === false))
          sameCourses.push({ key: currentSectionName.substring(0, 8), friends: currentCourseFriends });
      }
    }

    sameCourses.sort(function (a, b) {
      return (a.key < b.key) ? -1 : (a.key > b.key) ? 1 : 0;
    });

    return sameCourses;
  }

  findSameSections = () => {
    let sameSections = []; //Same sections array. Will have sectionName, sectionfriends
    //vvv Major loop da loop to record same sections and courses
    //Loop for each student
    for (let i = 0; i < this.state.courses.length - 1; i++) {
      //Loop for each course in this student's timetable
      for (let a = 0; a < this.state.courses[i].courseList.length; a++) {
        let currentSectionName = this.state.courses[i].courseList[a];
        let currentSectionFriends = [this.state.courses[i].key];
        //Loop for next students to check if they have the course
        for (let j = i + 1; j < this.state.courses.length; j++) {
          if (this.state.courses[j].courseList.indexOf(currentSectionName) >= 0)
            currentSectionFriends.push(this.state.courses[j].key);
        }
        //If there are common occurences found, add to sameSections
        if (currentSectionFriends.length > 1 && //Check if this is not a duplicate of a previous match record
          sameSections.map(e => { return (e.key === currentSectionName) }).every(e => e === false))
          sameSections.push({ key: currentSectionName, friends: currentSectionFriends });
      }
    }

    sameSections.sort(function (a, b) {
      return (a.key < b.key) ? -1 : (a.key > b.key) ? 1 : 0;
    });

    return sameSections;
  }

  //------------Who's free button functions

  findFree = () => {
    let freeTimes = [];
    let today = new Date();
    let currentTime = today.getHours() * 60 + today.getMinutes();
    //Loop for each student
    for (let i = 0; i < this.state.courses.length; i++) {
      let currentClassTimes = this.state.courses[i].classTimes;
      let hasClass = false;
      //Loop for each class
      for (let j = 0; j < currentClassTimes.length; j++) {
        //If the student has class right now
        if (currentClassTimes[j].start <= currentTime && currentTime < currentClassTimes[j].end) {
          hasClass = true;
          let timeToClassEnd = currentClassTimes[j].end - currentTime;
          if (timeToClassEnd <= 60) {
            //If this timing is not on the table yet
            if (freeTimes.filter(e => e.key).map(e => (+e.time.split(' ')[1])).indexOf(timeToClassEnd) == -1) {
              freeTimes.push({ key: "In " + timeToClassEnd.toString() + " min", friends: [this.state.courses[i].key] });
            }
            //If this timing is already on the table, with someone being free in that timing
            else {
              freeTimes.map(e => {
                if (e.key.contains(timeToClassEnd.toString()) && e.friends.indexOf(this.state.courses[i].key) == -1) {
                  e.friends.push(this.courses[i].key);
                }
              })
            }
          }
        }
      }
      //If the student doesn't have class
      if (!hasClass) {
        if (freeTimes.map(e => e.key).indexOf("Now") == -1) {
          freeTimes.push({ key: "Now", friends: [this.state.courses[i].key] })
        }
        else {
          freeTimes.map((e) => {
            if (e.key == "Now" && e.friends.indexOf(this.state.courses[i].key) == -1)
              e.friends.push(this.state.courses[i].key)
          })
        }
      }
    }

    return freeTimes;
  }

  //------------Table display functions

  displayOnTable = (table, text) => {
    let newText = [];
    for (let i = 0; i < text.length; i++) {
      newText.push(<tr><td>{text[i].key}</td><td>{text[i].friends.toString().replaceAll(",", ", ")}</td></tr>);
    }
    switch (table) {
      case "courses":
        this.setState(prevState =>
        ({
          tableTitleText: "Shared courses",
          tableHead1Text: "📚 Course",
          tableHead2Text: "👫 Friends",
          tableText: newText
        }));
        break;
      case "sections":
        this.setState(prevState =>
        ({
          tableTitleText: "Shared sections",
          tableHead1Text: "🧑‍🏫 Section",
          tableHead2Text: "👫 Friends",
          tableText: newText
        }));
        break;
      case "free":
        this.setState(prevState =>
        ({
          tableTitleText: "Who's free right now?",
          tableHead1Text: "🕒 Time",
          tableHead2Text: "👫 Friends",
          tableText: newText
        }))
        break;
      default: break;
    }
  }

  render() {

    return (
      <div className="App">
        <div className="row m-4 justify-content-around">
          <div className="card fixed col-md-5 p-0 mb-3">
            <div className="card-body">
              <h5 className='card-title'>Upload your Timetables</h5>
              <div className="m-1">
                <table className="table mb-2">
                  <thead>
                    <tr>
                      <th>Name</th>
                      <th>File</th>
                      <th></th>
                    </tr>
                  </thead>
                  <tbody id="timetablesTable">{this.state.timetablesText}</tbody>
                  <tfoot>
                    <tr>
                      <td colSpan={2}><p className='text-danger'>{this.state.errorMessage}</p></td>
                      <td><input className="btn btn-outline-primary" type="button" onClick={(e) => this.addField(e)} value="+" /></td>
                    </tr>
                  </tfoot>
                </table>
                <div className='row m-1'>
                  <button className="btn btn-primary" onClick={this.handleSubmit}>Submit</button>
                </div>
              </div>
              <div className="m-1">
                <p><small className="card-text help-text text-muted">Step 1: Find your Timetable on your SSC,
                  then click Download your schedule to your calendar software.
                  <br></br>
                  Step 2: Have your friends do the same and send the files over to you.
                  <br></br>
                  Step 3: Upload your timetables using the table above. If you want to match more than 2 friends, add more rows with the [+] button.</small></p>
              </div>
            </div>
          </div>
          <div className="fixed col-md-6 p-0">
            <div className="row p-0 mb-2 d-flex justify-content-around">
              <div className="col-lg-5 mb-3">
                <div className="row">
                  <button type="button" className="btn btn-outline-primary btn-courses" onClick={this.handleView} disabled={!this.state.submitted}>
                    📚 Courses in common
                  </button>
                </div>
              </div>
              <div className="col-lg-5 mb-3">
                <div className="row">
                  <button type="button" className="btn btn-outline-primary btn-sections" onClick={this.handleView} disabled={!this.state.submitted}>
                    🧑‍🏫 Sections in common
                  </button>
                </div>
              </div>
              <div className="col-lg-5 mb-3">
                <div className="row">
                  <button type="button" className="btn btn-outline-primary btn-free" onClick={this.handleView} disabled={!this.state.submitted}>
                    🙌 Who's free right now?
                  </button>
                </div>
              </div>
            </div>
            <div className="card fixed col-12">
              <div className="list-group list-group-flush">
                <div className="list-group-item list-group-item-primary pb-0 text-center">
                  <h5>{this.state.tableTitleText}</h5></div>
                <div className="list-group-item">
                  <table className='table'>
                    <thead>
                      <tr>
                        <th className='col-md-4'>{this.state.tableHead1Text}</th>
                        <th className='col-md-8'>{this.state.tableHead2Text}</th>
                      </tr>
                    </thead>
                    <tbody>{this.state.tableText}</tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default CourseMatcher;