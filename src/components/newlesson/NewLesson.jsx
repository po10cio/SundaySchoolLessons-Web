import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid'
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';

/* Form and form Control */
import FormControl from '@material-ui/core/FormControl'
import Select from '@material-ui/core/Select'
import FormHelperText from '@material-ui/core/FormHelperText'
import MenuItem from '@material-ui/core/MenuItem'
import Badge from '@material-ui/core/Badge'

/* Dialog */
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';

/* Snack */
import Snackbar from '@material-ui/core/Snackbar'

import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import CloudUploadIcon from '@material-ui/icons/CloudUpload'
import DatePicker from '../custom/DatePicker';
import Swal from 'sweetalert2';
import './NewLesson.css';
import { fireStoreDb } from '../../config';
import { BOOKS_COLLECTION, LESSONS_COLLECTION, CURRENT_SESSION, SESSIONS_COLLECTON } from './../../utils'
import update from 'immutability-helper';

const styles = theme => ({
  root: {
    flexGrow: 1,
    ...theme.mixins.gutters(),
    padding: theme.spacing.unit * 1,
  },
  container: {
    padding: theme.spacing.unit * 3,
  },
  paper: {
    padding: theme.spacing.unit * 2,
    textAlign: 'center',
  },
  badge: {
    margin: theme.spacing.unit * 2,
    padding: `0 ${theme.spacing.unit * 2}px`,

  },
  formControl: {
    margin: theme.spacing.unit * 2,
    width: '100%'
  },
  selectSession: {
    // marginTop: theme.spacing.unit * 2,
  },
  rightIcon: {
    marginLeft: theme.spacing.unit,
  },
  button: {
    margin: theme.spacing.unit,
    width: '40%'
  }
});


class NewLesson extends Component {
  constructor(props) {
    super(props)
    this.registrations = []
    this.state = {
      sessions: [],
      dialog: {
        open: false,
      },
      snack: {
        open: false,
        vertical: 'bottom',
        horizontal: 'left',
        message: ''
      },
      lesson: {
        centralTruth: '',
        focus: '',
        html: '',
        memoryVerse: '',
        number: 0,
        session: CURRENT_SESSION(),
        text: '',
        timestamp: null,
        topic: ''
      }
    }

    this.handleChange = this.handleChange.bind(this)
    this.handleLessonUpload = this.handleLessonUpload.bind(this)
    this.handleBadgeOnclick = this.handleBadgeOnclick.bind(this)
    this.fetchNexLessonNumber = this.fetchNexLessonNumber.bind(this)
    this.createSession = this.createSession.bind(this)
    this.handleSnackClose = this.handleSnackClose.bind(this)
    this.resetForm = this.resetForm.bind(this)

    //fetch the next lesson number immediatlry
    this.fetchNexLessonNumber(this.state.lesson.session)
  }

  resetForm = () => {
    let oldSession = this.state.lesson.session
    this.setState({
      lesson: {
        centralTruth: '',
        focus: '',
        html: '',
        memoryVerse: '',
        number: 0,
        session: oldSession,
        text: '',
        timestamp: null,
        topic: ''
      }
    })
  }

  handleSnackClose = () => {
    this.setState({ snack: { open: false } })
  }
  createSession = (session, setDefault) => {
    fireStoreDb.collection(SESSIONS_COLLECTON)
      .doc()
      .set({
        name: session,
        default: setDefault
      })
      .then(() => {
        console.log("New Session created Successfully: ", session)
      })
  }
  handleDialogClose = () => {
    this.setState({ dialog: { open: false } });
  };

  handleBadgeOnclick = event => {
    console.log("Handling Badge ONclick: ", event.target)
    this.setState({ dialog: { open: this.state.dialog.open ? false : true } })

  }

  handleChange = event => {
    console.log("onhandleChange: ", event.target)
    let name = event.target.name
    let value = event.target.value
    const newState = update(this.state, {
      lesson: { [name]: { $set: name === "timestamp" ? new Date(value) : value } },
    })
    this.setState(newState);

    if (name === "session") {
      this.fetchNexLessonNumber(value)
    }
  }

  fetchNexLessonNumber = (session) => {
    console.log("Fetching Lesson Number for session: ", session)
    fireStoreDb.collection(BOOKS_COLLECTION)
      .doc(session)
      .collection(LESSONS_COLLECTION)
      .get()
      .then((querySnapshot) => {
        let count = querySnapshot.size
        console.log("Lessons count: ", count)
        const newState = update(this.state, {
          lesson: { number: { $set: count + 1 } },
        })
        this.setState(newState);
      }).catch((error) => {
        console.log("Error getting Lesson count: ", error)
      })
  }

  handleLessonUpload = () => {
    console.log("Lessons: ", this.state.lesson)
    const uploadLesson = this.state.lesson

    //do small lessons validation
    if (!uploadLesson.session) {
      this.setState({
        snack: {
          ...this.state.snack,
          open: true,
          message: "Session is Required!"
        }
      })
      return
    }
    if (!uploadLesson.timestamp) {
      this.setState({
        snack: {
          ...this.state.snack,
          open: true,
          message: "Lesson date is required!"
        }
      })
      return
    }
    if (!uploadLesson.topic) {
      this.setState({
        snack: {
          ...this.state.snack,
          open: true,
          message: "Lesson topic is Required!"
        }
      })
      return
    }
    if (!uploadLesson.memoryVerse) {
      this.setState({
        snack: {
          ...this.state.snack,
          open: true,
          message: "Lesson Memory verse is Required!"
        }
      })
      return
    }
    if (!uploadLesson.text) {
      this.setState({
        snack: {
          ...this.state.snack,
          open: true,
          message: "Text  is Required!"
        }
      })
      return
    }
    if (!uploadLesson.centralTruth) {
      this.setState({
        snack: {
          ...this.state.snack,
          open: true,
          message: "Central truth is Required!"
        }
      })
      return
    }
    if (!uploadLesson.focus) {
      this.setState({
        snack: {
          ...this.state.snack,
          open: true,
          message: "Focus is Required!"
        }
      })
      return
    }
    if (!uploadLesson.html) {
      this.setState({
        snack: {
          ...this.state.snack,
          open: true,
          message: "Main lesson content (HTML) is Required!"
        }
      })
      return
    }

    //if we are here, it means we have every thin working fine.
    //upload the new lesson.
    //show swal
    Swal({
      title: 'Confirm!!!',
      text: 'Are u sure yo want to submit this lesson!',
      type: 'info',
      showCancelButton: true,
      showLoaderOnConfirm: true,
    }).then(result => {
      if (result.value) {
        Swal('Good job!', 'Lesson Upload Successful!', 'success');

        fireStoreDb.collection(BOOKS_COLLECTION)
          .doc(uploadLesson.session)
          .collection(LESSONS_COLLECTION)
          .add(uploadLesson)
          .then((docRef) => {
            console.log("Document written to: ", docRef.id)
            this.resetForm()
            this.fetchNexLessonNumber(this.state.lesson.session)

          }).catch(error => {
            console.log("Error creating a new Lesson.")
          })
      }
    })


  }

  componentDidMount() {
    let sessionSubscription = fireStoreDb
      .collection(SESSIONS_COLLECTON)
      .onSnapshot(querySnapshot => {
        let sessions = []
        querySnapshot.forEach((doc) => {
          console.log("Doc: ", doc.data().name)
          sessions.push(doc.data().name)
        })
        console.log("Sessions: ", sessions)
        this.setState({ sessions: sessions })
        if (!sessions.includes(CURRENT_SESSION())) {
          //create and set a new state as the current state
          this.createSession(CURRENT_SESSION(), true)
        }
      })

    this.registrations.push(sessionSubscription)
  }

  componentWillUnmount() {
    this.registrations.forEach(unsubscribe => { unsubscribe() })
  }
  render() {
    const { classes } = this.props;
    const { vertical, horizontal, open, message } = this.state.snack;

    const sessionsOptions = this.state.sessions.map((s, key) => {
      return <MenuItem key={key} value={s}>{s}</MenuItem>
    })
    console.log("Options: ", sessionsOptions)
    return (
      <div className={classes.root} >
        <Paper className={classes.paper} elevation={1}>
          <Badge
            onClick={this.handleBadgeOnclick}
            badgeContent={this.state.lesson.number}
            color="primary"
            className={classes.badge} >
            <Typography variant="headline" component="h3" align="center">
              Add New Sunday School Lesson!
            </Typography>
          </Badge>
          <Grid container spacing={24} className={classes.container}>
            <Grid item xs={3}>
              <FormControl className={classes.formControl}>
                <FormHelperText>Select Session</FormHelperText>
                <Select
                  value={this.state.lesson.session}
                  onChange={this.handleChange}
                  name="session"
                  displayEmpty
                  autoWidth={false}
                  className={classes.selectSession}>
                  <MenuItem value="" disabled>Avaiable Sessions</MenuItem>
                  {sessionsOptions}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={3}>
              <FormControl className={classes.formControl}>
                <DatePicker
                  name="timestamp"
                  value={this.state.lesson.timestamp}
                  onChange={this.handleChange}
                  label="Lesson Date" />
              </FormControl>
            </Grid>
            <Grid item xs={6}>
              <FormControl
                fullWidth
                className={classes.formControl} >
                <TextField
                  name="topic"
                  value={this.state.lesson.topic}
                  onChange={this.handleChange}
                  fullWidth
                  label="Lesson Topic" />
              </FormControl>
            </Grid>
            <Grid item xs={12}>
              <FormControl
                fullWidth
                className={classes.formControl} >
                <TextField
                  name="memoryVerse"
                  value={this.state.lesson.memoryVerse}
                  onChange={this.handleChange}
                  fullWidth
                  multiline
                  rows={2}
                  label="Memory Verse" />
              </FormControl>
            </Grid>
            <Grid item xs={4}>
              <FormControl
                fullWidth
                className={classes.formControl} >
                <TextField
                  name="text"
                  value={this.state.lesson.text}
                  onChange={this.handleChange}
                  fullWidth
                  multiline
                  rows={3}
                  label="Lesson Text" />
              </FormControl>
            </Grid>
            <Grid item xs={4}>
              <FormControl
                fullWidth
                className={classes.formControl} >
                <TextField
                  name="centralTruth"
                  value={this.state.lesson.centralTruth}
                  onChange={this.handleChange}
                  fullWidth
                  multiline
                  rows={3}
                  label="Central Truth" />
              </FormControl>
            </Grid>
            <Grid item xs={4}>
              <FormControl
                fullWidth
                className={classes.formControl} >
                <TextField
                  name="focus"
                  value={this.state.lesson.focus}
                  onChange={this.handleChange}
                  fullWidth
                  multiline
                  rows={3}
                  label="Focus" />
              </FormControl>
            </Grid>
            <Grid item xs={12}>
              <FormControl
                fullWidth
                className={classes.formControl} >
                <TextField
                  name="html"
                  value={this.state.lesson.html}
                  onChange={this.handleChange}
                  fullWidth
                  multiline
                  rows={20}
                  label="Lesson Content (HTML)" />
              </FormControl>
            </Grid>
          </Grid>
          <Button
            onClick={this.handleLessonUpload}
            variant="contained"
            color="default"
            className={classes.button}>
            Upload Lesson
                 <CloudUploadIcon className={classes.rightIcon} />
          </Button>
        </Paper>

        <Dialog
          open={this.state.dialog.open}
          onClose={this.handleDialogClose}
          aria-labelledby="form-dialog-title">
          <DialogTitle id="form-dialog-title">Update Lessons Number</DialogTitle>
          <DialogContent>
            <DialogContentText>
              Manully set the lessons number for this lessons upload!
            </DialogContentText>
            <TextField
              autoFocus
              margin="dense"
              name="number"
              onChange={this.handleChange}
              id="number"
              label="Lessons Number"
              defaultValue={this.state.lesson.number}
              type="number"
              fullWidth
            />
          </DialogContent>
          <DialogActions>
            <Button color="primary" onClick={this.handleDialogClose}>
              Update
            </Button>
          </DialogActions>
        </Dialog>

        <Snackbar
          anchorOrigin={{ vertical, horizontal }}
          open={open}
          onClose={this.handleSnack}
          ContentProps={{
            'aria-describedby': 'message-id',
          }}
          message={<span id="message-id">{message}</span>}
        />

      </div>
    );
  }
}

NewLesson.propTypes = {
  classes: PropTypes.object.isRequired
}

export default withStyles(styles)(NewLesson)
