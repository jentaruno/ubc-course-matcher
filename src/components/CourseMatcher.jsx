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
    sameCourseText: "",
    sameSectionText: "",
    submitted: false,
    tablePlaceholder: "show"
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

  //------------Upload button functions

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

    this.updateDropdown();
  }

  //------------Course matching functions

  handleSubmit = () => {
    this.setState(prevState => ({
      errorMessage: ""
    }));
    //See if any rows are not properly filled with a name and a file
    let timetables = document.getElementById("timetablesTable");
    for (let i = 0; i < timetables.rows.length; i++) {
      let currentRow = timetables.rows[i];
      if (currentRow.getElementsByTagName('input')[0].value == "" ||
        currentRow.getElementsByTagName('input')[1].files.length <= 0) {
        this.setState(prevState => ({
          errorMessage: "The table is not filled in correctly."
        }));
        return;
      }
    }
    //Check if there is more than 1 course uploaded, meaning we can start matching (may be redundant due to validation above) 
    if (this.state.courses.length > 1)
      this.setState(prevState => ({
        submitted: true
      }))
    //Read .ics files one by one
    let extractedCourses = this.state.courses.map(e => e.file.split('\n'))
      .map(e =>
        e.filter(e => e.includes("SUMMARY:"))
          .filter((v, i, a) => a.indexOf(v) === i)
          .map(e => e.substring(8, 20)));

    this.setState(prevState => ({
      courses: extractedCourses.map((e, i) => Object.assign({ student: document.getElementById("timetablesTable").rows[i].getElementsByTagName("input")[0].value, courseList: e }, this.state.courses[i]))
    }));
  }

  findSameSections = () => {
    let sameSections = []; //Same sections array. Will have sectionName, sectionMates
    let sameCourses = []; //Same courses array. Will have courseName, courseMates
    //vvv Major loop da loop to record same sections and courses
    //Loop for each student
    for (let i = 0; i < this.state.courses.length - 1; i++) {
      //Loop for each course in this student's timetable
      for (let a = 0; a < this.state.courses[i].courseList.length; a++) {
        let currentSectionName = this.state.courses[i].courseList[a];
        let currentSectionMates = [this.state.courses[i].student];
        let currentCourseMates = [this.state.courses[i].student];
        //Loop for next students to check if they have the course
        for (let j = i + 1; j < this.state.courses.length; j++) {
          if (this.state.courses[j].courseList.indexOf(currentSectionName) >= 0)
            currentSectionMates.push(this.state.courses[j].student);
          if (this.state.courses[j].courseList.map(e => e.substring(0, 8))
            .indexOf(currentSectionName.substring(0, 8)) >= 0)
            currentCourseMates.push(this.state.courses[j].student);
        }
        //If there are common occurences found, add to sameSections
        if (currentSectionMates.length > 1 && //Check if this is not a duplicate of a previous match record
          sameSections.map(e => { return (e.sectionName === currentSectionName) }).every(e => e === false))
          sameSections.push({ sectionName: currentSectionName, sectionMates: currentSectionMates });
        if (currentCourseMates.length > 1 && //Check if this is not a duplicate of a previous match record
          sameCourses.map(e => { return (e.courseName === currentSectionName.substring(0, 8)) }).every(e => e === false))
          sameCourses.push({ courseName: currentSectionName.substring(0, 8), courseMates: currentCourseMates });
      }
    }

    sameSections.sort(function (a, b) {
      return (a.sectionName < b.sectionName) ? -1 : (a.sectionName > b.sectionName) ? 1 : 0;
    });
    sameCourses.sort(function (a, b) {
      return (a.courseName < b.courseName) ? -1 : (a.courseName > b.courseName) ? 1 : 0;
    });

    this.displayCourses(sameCourses, sameSections);
  }

  displayCourses = (c, s) => {
    let newSameCourseText = [];
    let newSameSectionText = [];
    this.setState(prevState => ({ tablePlaceholder: "none" }));

    for (let i = 0; i < c.length; i++) {
      newSameCourseText.push(<tr><td>{c[i].courseName}</td><td>{c[i].courseMates.toString().replaceAll(",", ", ")}</td></tr>);
    }
    for (let i = 0; i < s.length; i++) {
      newSameSectionText.push(<tr><td>{s[i].sectionName}</td><td>{s[i].sectionMates.toString().replaceAll(",", ", ")}</td></tr>);
    }
    this.setState(prevState => ({
      sameCourseText: newSameCourseText,
      sameSectionText: newSameSectionText
    }))
  }

  handleView = (e) => {
    e.preventDefault();
    //Disable this function if submit hasnt been pressed yet
    this.handleSubmit();
    //Display course name, and people taking it together with you
    this.findSameSections();
  }

  updateDropdown = () => {
    //if number of students > 1 make button blue
    // if (courses[0].student)

    //list names

  }

  handleSave = (e) => {
    e.preventDefault();
  }

  render() {

    return (
      <div className="App">
        <div className="m-4">
          <div className="card col-md-6 mx-auto">
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
                <div className='m-1'>
                  <button className="btn btn-outline-primary" onClick={this.handleSubmit}>Submit</button>
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
              <div className="row m-1">
                <button className="btn btn-primary" onClick={this.handleView} disabled={!this.state.submitted}>
                  View courses in common
                </button>
              </div>
            </div>
          </div>
        </div>
        <div className="row m-4 justify-content-around">
          <div className="card col-md-5 p-0 mb-3">
            <div className="list-group list-group-flush">
              <div className="list-group-item list-group-item-primary pb-0 text-center"><h5>Shared courses</h5></div>
              <div className="list-group-item">
                <table className='table'>
                  <thead>
                    <tr>
                      <th className='col-md-4'>📚 Course</th>
                      <th className='col-md-8'>👫 Friends</th>
                    </tr>
                  </thead>
                  <tbody>{this.state.sameCourseText}</tbody>
                  <tfoot><tr>
                    <td colSpan="2" className='table-secondary help-text text-muted  text-center' style={{ display: this.state.tablePlaceholder }}><em><small>
                      Shared courses and names of people who share them will be displayed here.
                    </small></em></td>
                  </tr></tfoot>
                </table>
              </div>
            </div>
          </div>
          <div className="card col-md-5 p-0 mb-3">
            <div className="list-group list-group-flush">
              <div className="list-group-item list-group-item-primary pb-0 text-center"><h5>Shared sections</h5></div>
              <div className="list-group-item">
                <table className='table'>
                  <thead>
                    <tr>
                      <th className='col-md-4'>🧑‍🏫 Section</th>
                      <th className='col-md-8'>👫 Friends</th>
                    </tr>
                  </thead>
                  <tbody>{this.state.sameSectionText}</tbody>
                  <tfoot><tr>
                    <td colSpan="2" className='table-secondary help-text text-muted text-center' style={{ display: this.state.tablePlaceholder }}><em><small>
                      Shared sections and names of people who share them will be displayed here.
                    </small></em></td>
                  </tr></tfoot>
                </table>
              </div>
            </div>
          </div>
        </div>
        <div className="m-4">
          <div className="card col-md-6 text-center mx-auto mt-3">
            <div className='card-body'>
              <button className="btn btn-outline-primary" onClick={this.handleSave} disabled={!this.state.submitted}>
                <span>Save to </span>
                <select>
                  <option value="" /*disabled selected*/>---</option>
                </select>
                <span>'s Google Calendar</span></button>
              <br></br>
              <span className="help-text text-muted">Add classmates taking classes together with you in your courses' event
                descriptions.</span>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default CourseMatcher;