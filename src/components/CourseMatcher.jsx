import React, { useState, Component } from 'react';
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import QRCode from 'react-qr-code';
import QrScanner from 'qr-scanner';
import Cookies from 'universal-cookie';

class CourseMatcher extends Component {

  state = {
    userErrorMessage: "",
    friendsErrorMessage: "",
    userName: "User",
    userCourses: "",
    timetablesText: [],
    timetablesPlaceholder: <tr><td colSpan="2" className='table-secondary help-text text-muted  text-center'><em><small>
      After you scan your friends' QR codes, their names will be displayed here.
    </small></em></td></tr>,

    courseFiles: [],
    courses: [{}],       //Courses reading array. Will have courseList, file, student

    submittedFile: false,
    submitted: false,

    tableTitleText: "",
    tableHead1Text: "",
    tableHead2Text: "",
    tableText: <tr><td colSpan="2" className='table-secondary help-text text-muted  text-center'><em><small>
      After uploading your files, click Submit and press one of the two buttons above. The information you need will be displayed here.
    </small></em></td></tr>,

    modalDisplay: false,
    modalHeader: "",
    displayQR: "none",
    displayQRScanner: "none",
    qrCodeValue: "",
    qrScanner: "",
    svgRef: React.createRef(),

    nameCookie: "",
    courseCookie: ""
  }

  componentDidMount() {
    this.loadCookies();
  }

  //------------Basic table functions

  handleDeleteRow = (e) => {
    let currentRow = e.target.closest("tr");
    let newCourses = this.state.courses;
    newCourses.splice(currentRow.rowIndex, 1);
    this.updatePlaceholder();
    this.setState(prevState => ({
      courses: newCourses,
      submitted: false
    }));
    currentRow.remove();
  }

  handleChangeName = (e) => {
    this.setState({ userName: e.target.value })
  }

  updatePlaceholder = () => {
    if (!this.state.courses[1])
      this.setState({
        timetablesPlaceholder: <tr><td colSpan="2" className='table-secondary help-text text-muted  text-center'><em><small>
          After you scan your friends' QR codes, their names will be displayed here.
        </small></em></td></tr>
      });
    else
      this.setState({ timetablesPlaceholder: "" });
  }

  //------------Upload and submit button functions

  handleUpload = (e) => {
    let file = e.target.files[0];
    let newCourses = [];
    let reader = new FileReader();
    reader.readAsText(file);
    reader.onload = function () {
      newCourses[0] = { file: reader.result };
    };
    reader.onerror = function () {
      console.log(reader.error);
    };
    this.setState(prevState => ({
      courseFiles: newCourses
    }));
  }

  handleSubmitFile = (e) => {
    e.preventDefault();
    if (this.isFormValid()) {
      this.setState({ submittedFile: true });
      this.readCourses();
      this.saveCookies(this.state.courses[0].key, this.state.courses[0].courseList);
      let newUserCourses = this.state.courses[0].courseList.map(e => " " + e);
      this.setState({ userCourses: "Loaded courses:" + newUserCourses });
    }
  }

  handleSubmit = () => {
    if (this.isTableValid()) {
      this.setState({ submitted: true });
      this.displayOnTable("courses", [""]);
      this.displayOnTable("sections", [""]);
    }
  }

  readCourses = () => {
    //Read courses one by one
    let extractedCourses = this.state.courseFiles.map(e => e.file.split('\n'))
      .map(e =>
        e.filter(e => e.includes("SUMMARY:"))
          .filter((v, i, a) => a.indexOf(v) === i)
          .map(e => e.substring(8, 20)));
    let newCourses = this.state.courses;
    newCourses[0] = {
      key: this.state.userName,
      courseList: extractedCourses[0]
    }
    //Change state of courses data
    this.setState({
      courses: newCourses
    });
  }

  saveCookies = (name, courseList) => {
    let nameCookie;
    let courseCookie;
    let expiryDate = new Date();
    expiryDate.setMonth(expiryDate.getMonth() + 10)
    if (this.state.nameCookie == "" || this.state.courseCookie == "") {
      nameCookie = new Cookies();
      courseCookie = new Cookies();
      nameCookie.set('name', name, { path: '/', expires: expiryDate });
      courseCookie.set('courseList', courseList, { path: '/', expires: expiryDate });
    }
    else {
      nameCookie = this.state.nameCookie;
      courseCookie = this.state.courseCookie;
      nameCookie.set('name', name, { path: '/', expires: expiryDate });
      courseCookie.set('courseList', courseList, { path: '/', expires: expiryDate });
    }
    this.setState({ nameCookie: nameCookie, courseCookie: courseCookie });
    console.log(nameCookie.get('name'));
    console.log(courseCookie.get('courseList'));
  }

  loadCookies = () => {
    console.log("Loading cookies");
    let nameCookie = new Cookies();
    let courseCookie = new Cookies();
    try {
      let userCourses = courseCookie.get('courseList')
      let newCourses = this.state.courses;
      nameCookie = nameCookie.get('name');
      newCourses[0] = { key: nameCookie, courseList: userCourses };
      userCourses = userCourses.map(e => " " + e)
      this.setState({
        userName: nameCookie,
        userCourses: "Loaded courses:" + userCourses,
        courses: newCourses,
        submittedFile: true
      });
      document.getElementById('user-name').value = nameCookie.get('name');
    } catch (e) {
      console.log("No cookies were loaded.");
    }
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
  }

  findSameCourses = () => {
    let sameCourses = []; //Same courses array. Will have courseName, courseMates
    //vvv Major loop da loop to record same sections and courses
    //Loop for each student
    for (let i = 0; i < this.state.courses.length; i++) {
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
    for (let i = 0; i < this.state.courses.length; i++) {
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

  isFormValid = () => {
    let newErrorMessage = "";
    if (!document.getElementById("user-name").value.trim())
      newErrorMessage = "Please fill in your name.";
    if (document.getElementById("user-file").files.length < 1)
      newErrorMessage = "Please upload your file.";
    this.displayErrorMessage("user", newErrorMessage);
    if (newErrorMessage != "")
      return false;

    return true;
  }

  isTableValid = () => {
    let courses = this.state.courses;
    let newErrorMessage = "";
    if (courses.length < 2)
      newErrorMessage = "You need to have at least two files to start matching.";
    if (new Set(courses.map(e => e.key)).size !== courses.length || new Set(courses.map(e => e.courseList)).size !== courses.length)
      newErrorMessage = "There are duplicate names or files."
    this.displayErrorMessage("friends", newErrorMessage);

    if (newErrorMessage != "")
      return false;

    return true;
  }

  //-------------QR Code functions

  handleQrCode = () => {
    if (!this.state.submittedFile)
      return;
    this.setState({
      modalDisplay: true,
      displayQR: "show",
      modalHeader: this.state.userName + "'s Timetable QR Code",
      qrCodeValue: JSON.stringify(this.state.courses[0])
    });
  }

  handleScanQRCode = () => {
    // this.setState({
    //   modalDisplay: true,
    //   displayQRScanner: "show",
    //   modalHeader: "Scan QR Code",
    // })

    if (this.state.qrScanner == "") {
      let qrScanner = new QrScanner(
        document.getElementById("qr-video"),
        result => this.processQRCode(result, qrScanner),
        {
          returnDetailedScanResult: true,
          highlightScanRegion: true
        }
      );
      this.setState({ qrScanner: qrScanner });
      qrScanner.start();
    }
    else
      this.state.qrScanner.start();
  }

  processQRCode = (result, qrScanner) => {
    if (!this.isQRValid(result.data))
      return;

    //Add scanned QR code to courses array
    let currentCourses = this.state.courses;
    let newTimetablesText = this.state.timetablesText;
    let addedCourse = JSON.parse(result.data);
    currentCourses.push(addedCourse);
    newTimetablesText[0] = "";
    newTimetablesText.push(<tr><td>{this.randomEmoji()} {addedCourse.key}</td>
      <td><button className="btn btn-outline-danger btn-sm deleteBtn" onClick={(e) => this.handleDeleteRow(e)}>X</button></td></tr>);
    this.setState({
      courses: currentCourses,
      timetablesText: newTimetablesText,
      submitted: false
    });

    //Update placeholder text
    this.updatePlaceholder();

    //Stop video after done
    if (this.state.qrScanner != "")
      this.state.qrScanner.stop();
  }

  isQRValid = (str) => {
    try {
      JSON.parse(str);
    } catch (e) {
      this.setState({ errorMessage: "This isn't a valid course QR Code!" });
      return false;
    }
    let data = JSON.parse(str);
    if (!data.key || !data.courseList)
      return false;

    return true;
  }

  randomEmoji = () => {
    var emojis = [
      '😄', '😃', '😀', '😊', '☺', '😉', '😍', '😘', '😚', '😗', '😙', '😜', '😝', '😛', '😳', '😁', '😔', '😌', '😒', '😞', '😣', '😢', '😂', '😭', '😪', '😥', '😰', '😅', '😓', '😩', '😫', '😨', '😱', '😠', '😡', '😤', '😖', '😆', '😋', '😷', '😎', '😴', '😵', '😲', '😟', '😦', '😧', '😈', '👿', '😮', '😬', '😐', '😕', '😯', '😶', '😇', '😏', '😑', '👲', '👳', '👮', '👷', '💂', '👶', '👦', '👧', '👨', '👩', '👴', '👵', '👱', '👼', '👸', '😺', '😸', '😻', '😽', '😼', '🙀', '😿', '😹', '😾', '👹', '👺', '🙈', '🙉', '🙊', '💀', '👽', '💩', '🔥', '✨', '🌟', '💫', '💥', '💢', '💦', '💧', '💤', '💨', '👂', '👀', '👃', '👅', '👄', '👍', '👎', '👌', '👊', '✊', '✌', '👋', '✋', '👐', '👆', '👇', '👉', '👈', '🙌', '🙏', '☝', '👏', '💪', '🚶', '🏃', '💃', '👫', '👪', '👬', '👭', '💏', '💑', '👯', '🙆', '🙅', '💁', '🙋', '💆', '💇', '💅', '👰', '🙎', '🙍', '🙇', '🎩', '👑', '👒', '👟', '👞', '👡', '👠', '👢', '👕', '👔', '👚', '👗', '🎽', '👖', '👘', '👙', '💼', '👜', '👝', '👛', '👓', '🎀', '🌂', '💄', '💛', '💙', '💜', '💚', '❤', '💔', '💗', '💓', '💕', '💖', '💞', '💘', '💌', '💋', '💍', '💎', '👤', '👥', '💬', '👣', '💭', '🐶', '🐺', '🐱', '🐭', '🐹', '🐰', '🐸', '🐯', '🐨', '🐻', '🐷', '🐽', '🐮', '🐗', '🐵', '🐒', '🐴', '🐑', '🐘', '🐼', '🐧', '🐦', '🐤', '🐥', '🐣', '🐔', '🐍', '🐢', '🐛', '🐝', '🐜', '🐞', '🐌', '🐙', '🐚', '🐠', '🐟', '🐬', '🐳', '🐋', '🐄', '🐏', '🐀', '🐃', '🐅', '🐇', '🐉', '🐎', '🐐', '🐓', '🐕', '🐖', '🐁', '🐂', '🐲', '🐡', '🐊', '🐫', '🐪', '🐆', '🐈', '🐩', '🐾', '💐', '🌸', '🌷', '🍀', '🌹', '🌻', '🌺', '🍁', '🍃', '🍂', '🌿', '🌾', '🍄', '🌵', '🌴', '🌲', '🌳', '🌰', '🌱', '🌼', '🌐', '🌞', '🌝', '🌚', '🌑', '🌒', '🌓', '🌔', '🌕', '🌖', '🌗', '🌘', '🌜', '🌛', '🌙', '🌍', '🌎', '🌏', '🌋', '🌌', '🌠', '⭐', '☀', '⛅', '☁', '⚡', '☔', '❄', '⛄', '🌀', '🌁', '🌈', '🌊', '🎍', '💝', '🎎', '🎒', '🎓', '🎏', '🎆', '🎇', '🎐', '🎑', '🎃', '👻', '🎅', '🎄', '🎁', '🎋', '🎉', '🎊', '🎈', '🎌', '🔮', '🎥', '📷', '📹', '📼', '💿', '📀', '💽', '💾', '💻', '📱', '☎', '📞', '📟', '📠', '📡', '📺', '📻', '🔊', '🔉', '🔈', '🔇', '🔔', '🔕', '📢', '📣', '⏳', '⌛', '⏰', '⌚', '🔓', '🔒', '🔏', '🔐', '🔑', '🔎', '💡', '🔦', '🔆', '🔅', '🔌', '🔋', '🔍', '🛁', '🛀', '🚿', '🚽', '🔧', '🔩', '🔨', '🚪', '🚬', '💣', '🔫', '🔪', '💊', '💉', '💰', '💴', '💵', '💷', '💶', '💳', '💸', '📲', '📧', '📥', '📤', '✉', '📩', '📨', '📯', '📫', '📪', '📬', '📭', '📮', '📦', '📝', '📄', '📃', '📑', '📊', '📈', '📉', '📜', '📋', '📅', '📆', '📇', '📁', '📂', '✂', '📌', '📎', '✒', '✏', '📏', '📐', '📕', '📗', '📘', '📙', '📓', '📔', '📒', '📚', '📖', '🔖', '📛', '🔬', '🔭', '📰', '🎨', '🎬', '🎤', '🎧', '🎼', '🎵', '🎶', '🎹', '🎻', '🎺', '🎷', '🎸', '👾', '🎮', '🃏', '🎴', '🀄', '🎲', '🎯', '🏈', '🏀', '⚽', '⚾', '🎾', '🎱', '🏉', '🎳', '⛳', '🚵', '🚴', '🏁', '🏇', '🏆', '🎿', '🏂', '🏊', '🏄', '🎣', '☕', '🍵', '🍶', '🍼', '🍺', '🍻', '🍸', '🍹', '🍷', '🍴', '🍕', '🍔', '🍟', '🍗', '🍖', '🍝', '🍛', '🍤', '🍱', '🍣', '🍥', '🍙', '🍘', '🍚', '🍜', '🍲', '🍢', '🍡', '🍳', '🍞', '🍩', '🍮', '🍦', '🍨', '🍧', '🎂', '🍰', '🍪', '🍫', '🍬', '🍭', '🍯', '🍎', '🍏', '🍊', '🍋', '🍒', '🍇', '🍉', '🍓', '🍑', '🍈', '🍌', '🍐', '🍍', '🍠', '🍆', '🍅', '🌽', '🏠', '🏡', '🏫', '🏢', '🏣', '🏥', '🏦', '🏪', '🏩', '🏨', '💒', '⛪', '🏬', '🏤', '🌇', '🌆', '🏯', '🏰', '⛺', '🏭', '🗼', '🗾', '🗻', '🌄', '🌅', '🌃', '🗽', '🌉', '🎠', '🎡', '⛲', '🎢', '🚢', '⛵', '🚤', '🚣', '⚓', '🚀', '✈', '💺', '🚁', '🚂', '🚊', '🚉', '🚞', '🚆', '🚄', '🚅', '🚈', '🚇', '🚝', '🚋', '🚃', '🚎', '🚌', '🚍', '🚙', '🚘', '🚗', '🚕', '🚖', '🚛', '🚚', '🚨', '🚓', '🚔', '🚒', '🚑', '🚐', '🚲', '🚡', '🚟', '🚠', '🚜', '💈', '🚏', '🎫', '🚦', '🚥', '⚠', '🚧', '🔰', '⛽', '🏮', '🎰', '♨', '🗿', '🎪', '🎭', '📍', '🚩', '⬆', '⬇', '⬅', '➡', '🔠', '🔡', '🔤', '↗', '↖', '↘', '↙', '↔', '↕', '🔄', '◀', '▶', '🔼', '🔽', '↩', '↪', 'ℹ', '⏪', '⏩', '⏫', '⏬', '⤵', '⤴', '🆗', '🔀', '🔁', '🔂', '🆕', '🆙', '🆒', '🆓', '🆖', '📶', '🎦', '🈁', '🈯', '🈳', '🈵', '🈴', '🈲', '🉐', '🈹', '🈺', '🈶', '🈚', '🚻', '🚹', '🚺', '🚼', '🚾', '🚰', '🚮', '🅿', '♿', '🚭', '🈷', '🈸', '🈂', 'Ⓜ', '🛂', '🛄', '🛅', '🛃', '🉑', '㊙', '㊗', '🆑', '🆘', '🆔', '🚫', '🔞', '📵', '🚯', '🚱', '🚳', '🚷', '🚸', '⛔', '✳', '❇', '❎', '✅', '✴', '💟', '🆚', '📳', '📴', '🅰', '🅱', '🆎', '🅾', '💠', '➿', '♻', '♈', '♉', '♊', '♋', '♌', '♍', '♎', '♏', '♐', '♑', '♒', '♓', '⛎', '🔯', '🏧', '💹', '💲', '💱', '©', '®', '™', '〽', '〰', '🔝', '🔚', '🔙', '🔛', '🔜', '❌', '⭕', '❗', '❓', '❕', '❔', '🔃', '🕛', '🕧', '🕐', '🕜', '🕑', '🕝', '🕒', '🕞', '🕓', '🕟', '🕔', '🕠', '🕕', '🕖', '🕗', '🕘', '🕙', '🕚', '🕡', '🕢', '🕣', '🕤', '🕥', '🕦', '✖', '➕', '➖', '➗', '♠', '♥', '♣', '♦', '💮', '💯', '✔', '☑', '🔘', '🔗', '➰', '🔱', '🔲', '🔳', '◼', '◻', '◾', '◽', '▪', '▫', '🔺', '⬜', '⬛', '⚫', '⚪', '🔴', '🔵', '🔻', '🔶', '🔷', '🔸', '🔹'
    ];

    return emojis[Math.floor(Math.random() * emojis.length)];
  }

  handleHideModal = () => {
    this.setState({
      modalDisplay: false,
      displayQR: "none",
      displayQRScanner: "none",
    });
    let qrScanner = document.getElementsByTagName("QRCode");
    if (this.state.qrScanner != "")
      this.state.qrScanner.stop();
  }

  //------------Table display functions

  displayErrorMessage = (element, message) => {
    switch (element) {
      case "user": this.setState({ userErrorMessage: message }); break;
      case "friends": this.setState({ friendsErrorMessage: message }); break;
      default: break;
    }
  }

  displayOnTable = (table, text) => {
    let newText = [];
    for (let i = 0; i < text.length; i++) {
      newText.push(<tr><td>{text[i].key}</td><td>{text[i].friends.toString().replaceAll(",", ", ")}</td></tr>);
    }
    switch (table) {
      case "courses":
        if (newText.length == 0)
          newText[0] = <tr><td colSpan="2" className='table-secondary help-text text-muted  text-center'><em><small>
            It seems like you're not taking any courses together.
          </small></em></td></tr>;
        this.setState(prevState =>
        ({
          tableTitleText: "Shared courses",
          tableHead1Text: "📚 Course",
          tableHead2Text: "👫 Friends",
          tableText: newText
        }));
        break;
      case "sections":
        if (newText.length == 0)
          newText[0] = <tr><td colSpan="2" className='table-secondary help-text text-muted  text-center'><em><small>
            It seems like you're not taking any sections together.
          </small></em></td></tr>;
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
          <div className="card col-md-5 p-0 mb-4">
            <div className="card-body">
              <h5 className='card-title'>Upload your Timetable</h5>
              <div className="m-1">
                <p><small className="card-text help-text text-muted">Find your Timetable on your <a href='https://ssc.adm.ubc.ca/sscportal' rel='noreferrer' target="_blank">SSC</a>,
                  then click <em>Download your schedule to your calendar software</em>.</small></p>
              </div>
              <div className="m-1">
                <table className='table'>
                  <tbody id="userTimetable">
                    <tr>
                      <td><input type="text" id="user-name" className="form-control" placeholder="Your name" onChange={(e) => this.handleChangeName(e)} /></td>
                      <td><input type="file" id='user-file' accept=".ics" className="form-control" onChange={(e) => this.handleUpload(e)} /></td>
                    </tr>
                  </tbody>
                </table>
                <div className="row m-1">
                  <button className="btn btn-outline-primary" onClick={this.handleSubmitFile}>Submit</button>
                </div>
                <div className="mt-2">
                  <small className='text-muted'>{this.state.userCourses}</small>
                  <p className='text-danger'>{this.state.userErrorMessage}</p>
                </div>
              </div>
            </div>
          </div>
          <div className="card fixed col-md-6 p-0 mb-4">
            <div className="card-body">
              <h5 className='card-title'>Add your friends' Timetables</h5>
              <div className="row px-1 d-flex justify-content-around">
                <div className="col-lg-6">
                  <Button className='table' variant="primary" onClick={this.handleQrCode} disabled={!this.state.submittedFile}>
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-qr-code mb-1" viewBox="0 0 16 16">
                      <path d="M2 2h2v2H2V2Z" />
                      <path d="M6 0v6H0V0h6ZM5 1H1v4h4V1ZM4 12H2v2h2v-2Z" />
                      <path d="M6 10v6H0v-6h6Zm-5 1v4h4v-4H1Zm11-9h2v2h-2V2Z" />
                      <path d="M10 0v6h6V0h-6Zm5 1v4h-4V1h4ZM8 1V0h1v2H8v2H7V1h1Zm0 5V4h1v2H8ZM6 8V7h1V6h1v2h1V7h5v1h-4v1H7V8H6Zm0 0v1H2V8H1v1H0V7h3v1h3Zm10 1h-1V7h1v2Zm-1 0h-1v2h2v-1h-1V9Zm-4 0h2v1h-1v1h-1V9Zm2 3v-1h-1v1h-1v1H9v1h3v-2h1Zm0 0h3v1h-2v1h-1v-2Zm-4-1v1h1v-2H7v1h2Z" />
                      <path d="M7 12h1v3h4v1H7v-4Zm9 2v2h-3v-1h2v-1h1Z" />
                    </svg>
                    <span> Share your QR Code</span>
                  </Button>
                  <Modal show={this.state.modalDisplay} onHide={this.handleHideModal}>
                    <Modal.Header closeButton>
                      <Modal.Title>{this.state.modalHeader}</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                      <div style={{
                        height: "auto",
                        margin: "0 auto",
                        maxWidth: 300,
                        width: "100%",
                        display: this.state.displayQR
                      }}>
                        <QRCode
                          ref={this.svgRef}
                          size={4000}
                          style={{ height: "auto", maxWidth: "100%", width: "100%" }}
                          value={this.state.qrCodeValue}
                          viewBox={`0 0 256 256`}
                        />
                      </div>
                    </Modal.Body>
                  </Modal>
                </div>
                <div className="col-lg-6">
                  <Button className='table' variant='primary' onClick={this.handleScanQRCode}>
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-qr-code-scan mb-1" viewBox="0 0 16 16">
                      <path d="M0 .5A.5.5 0 0 1 .5 0h3a.5.5 0 0 1 0 1H1v2.5a.5.5 0 0 1-1 0v-3Zm12 0a.5.5 0 0 1 .5-.5h3a.5.5 0 0 1 .5.5v3a.5.5 0 0 1-1 0V1h-2.5a.5.5 0 0 1-.5-.5ZM.5 12a.5.5 0 0 1 .5.5V15h2.5a.5.5 0 0 1 0 1h-3a.5.5 0 0 1-.5-.5v-3a.5.5 0 0 1 .5-.5Zm15 0a.5.5 0 0 1 .5.5v3a.5.5 0 0 1-.5.5h-3a.5.5 0 0 1 0-1H15v-2.5a.5.5 0 0 1 .5-.5ZM4 4h1v1H4V4Z" />
                      <path d="M7 2H2v5h5V2ZM3 3h3v3H3V3Zm2 8H4v1h1v-1Z" />
                      <path d="M7 9H2v5h5V9Zm-4 1h3v3H3v-3Zm8-6h1v1h-1V4Z" />
                      <path d="M9 2h5v5H9V2Zm1 1v3h3V3h-3ZM8 8v2h1v1H8v1h2v-2h1v2h1v-1h2v-1h-3V8H8Zm2 2H9V9h1v1Zm4 2h-1v1h-2v1h3v-2Zm-4 2v-1H8v1h2Z" />
                      <path d="M12 9h2V8h-2v1Z" />
                    </svg>
                    <span> Add friend's Timetable</span>
                  </Button>
                </div>
              </div>
              <video style={{ width: "100%" }}
                id="qr-video" disablePictureInPicture playsInline />
              <table className="table mb-4">
                <thead>
                  <tr>
                    <th className='col-11'>Name</th>
                    <th className='col-1'></th>
                  </tr>
                </thead>
                <tbody id="timetablesTable">{this.state.timetablesText}</tbody>
                <tfoot>
                  {this.state.timetablesPlaceholder}
                  <tr>
                    <td colSpan={2}><p className='text-danger'>{this.state.friendsErrorMessage}</p></td>
                  </tr>
                </tfoot>
              </table>
              <div className='row m-1'>
                <button className="btn btn-outline-primary" onClick={this.handleSubmit}>Submit</button>
              </div>
            </div>
          </div>
          <div className="fixed col-md-8 p-0">
            <div className="row p-0 mx-1 mb-2 d-flex justify-content-around">
              <div className="col-lg-5 mb-3">
                <div className="row">
                  <button type="button" className="btn btn-primary btn-courses" onClick={this.handleView} disabled={!this.state.submitted}>
                    📚 Courses in common
                  </button>
                </div>
              </div>
              <div className="col-lg-5 mb-3">
                <div className="row">
                  <button type="button" className="btn btn-primary btn-sections" onClick={this.handleView} disabled={!this.state.submitted}>
                    🧑‍🏫 Sections in common
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
      </div >
    );
  }
}

export default CourseMatcher;