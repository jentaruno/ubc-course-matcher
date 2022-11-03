import React, { Component } from 'react';

class CourseMatcher extends Component {

  state = {
    courses: [{}],       //Courses reading array. Will have courseList, file, student
    sameCourseText: "",
    sameSectionText: "",
    submitted: false,
    tablePlaceholder: "show"
  }

  //------------Upload button functions

  readFileContents = async (file) => {
    return new Promise((resolve, reject) => {
      let fileReader = new FileReader();
      fileReader.onload = () => {
        resolve(fileReader.result);
      };
      fileReader.onerror = reject;
      fileReader.readAsText(file);
    });
  }

  readAllFiles = async (AllFiles) => {
    const results = await Promise.all(AllFiles.map(async (file) => {
      const fileContents = await this.readFileContents(file);
      return fileContents;
    }));

    this.setState(prevState => ({
      courses: results.map((e, i) => Object.assign({ file: e }, this.state.courses[i]))
    }));
  }

  handleUpload = (e) => {
    this.setState(prevState => ({
      submitted: false
    }));

    let AllFiles = [];
    [...e.target.files].forEach(file => AllFiles.push(file));

    this.readAllFiles(AllFiles);

    this.setState(prevState => ({
      courses: AllFiles.map((e, i) => Object.assign({ student: e.name.replace(".ics", "") }, this.state.courses[i]))
    }));
    this.updateDropdown();
  }

  //------------Course matching functions

  handleSubmit = () => {
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
      courses: extractedCourses.map((e, i) => Object.assign({ courseList: e }, this.state.courses[i]))
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
    //disable this function if submit hasnt been pressed yet
    this.handleSubmit();
    //Display course name, and people taking it together with you
    console.log(this.state.courses);
    this.findSameSections();
    this.setState(prevState => ({
      courses: [{}]
    }));
    document.getElementById("fileUpload").value = "";
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
              <div className="row mt-2">
                <div className="col-md-9 mb-2">
                  <input id="fileUpload" className="form-control w-100" type="file" accept=".ics" multiple onChange={(e) => this.handleUpload(e)} />
                </div>
                <div className="col-md-3 mb-2">
                  <button className="btn btn-outline-primary" onClick={this.handleSubmit}>Submit</button>
                </div>
              </div>
              <p><small className="card-text help-text text-muted mt-2">Step 1: Find your Timetables on your SSC,
                then click Download your schedule to your calendar software.
                <br></br>
                Step 2: Rename your .ics files to your names (e.g. Jen.ics, Daniel.ics, etc)
                <br></br>
                Step 3: Collect all the Timetables you want to match, click on the Choose Files button to upload them (can be as many as you want!)</small></p>
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