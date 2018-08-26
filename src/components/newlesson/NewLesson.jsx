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

import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import CloudUploadIcon from '@material-ui/icons/CloudUpload'
import DatePicker from '../custom/DatePicker';
import Swal from 'sweetalert2';
import './NewLesson.css';
import { fireStoreDb } from '../../config';
import { BOOKS_COLLECTION } from './../../utils'
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
      dialogOpen: false,
      lesson: {
        centralTruth: '',
        focus: '',
        html: '',
        memoryVerse: '',
        number: 1,
        session: '',
        text: '',
        timestamp: new Date(),
        topic: ''
      }
    }

    this.handleChange = this.handleChange.bind(this)
    this.handleLessonUpload = this.handleLessonUpload.bind(this)
    this.handleBadgeOnclick = this.handleBadgeOnclick.bind(this)
  }

  handleDialogClose = () => {
    this.setState({ dialogOpen: false });
  };

  handleBadgeOnclick = event => {
    console.log("Handling Badge ONclick: ", event.target)
    this.setState({ dialogOpen: this.state.dialogOpen ? false : true })

  }

  handleChange = event => {
    console.log("onhandleChange: ", event.target)
    let name = event.target.name
    let value = event.target.value
    const newState = update(this.state, {
      lesson: { [name]: { $set: name == "timestamp" ? new Date(value) : value } },
    })
    this.setState(newState);
  }

  handleLessonUpload = event => {
    console.log("Handing Lesson Upload Here: ", event.target)
    console.log("Lessons: ", this.state.lesson)
  }
  componentDidMount() {
    fireStoreDb.doc("Books/201801/Lessons/DrAK2BBDceoadF63zd8L")
      .get()
      .then(doc => {
        if (doc.exists) {
          console.log("Document data:", doc.data());
        } else {
          // doc.data() will be undefined in this case
          console.log("No such document!");
        }
      })
      .catch(error => {
        console.log("Error getting document: ", error)
      })
    let sessionSubscription = fireStoreDb
      .collection(BOOKS_COLLECTION)
      .onSnapshot(onSnapshot => {
        let sessions = onSnapshot.docChanges().map(session => session.doc.id)
        console.log("Sessions: ", sessions)
        this.setState({ sessions: sessions })
      })

    this.registrations.push(sessionSubscription)
  }

  componentWillUnmount() {
    this.registrations.map(unsubscribe => { unsubscribe() })
  }
  render() {
    const { classes } = this.props;
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
                  onChange={this.handleChange}
                  fullWidth
                  label="Memory Verse" />
              </FormControl>
            </Grid>
            <Grid item xs={4}>
              <FormControl
                fullWidth
                className={classes.formControl} >
                <TextField
                  name="text"
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
          open={this.state.dialogOpen}
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

      </div>
    );
  }
}

NewLesson.propTypes = {
  classes: PropTypes.object.isRequired
}

export default withStyles(styles)(NewLesson)
