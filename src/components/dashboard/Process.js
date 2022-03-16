import React from 'react'
import Request from '../../utils/Request'
import { Typography, Skeleton, Modal, Card, Box, Button, Grid } from '@mui/material'
import Action from '../Action'

class Process extends React.Component {

    constructor(props) {
        super(props)
        this.state = {
            loading: true,
            process: {},
            open: false,
            inputs: []
        }
    }

    async componentDidMount() {
        let result = await new Request().get().fetch("/api/processes/" + this.props.source.object)
        if (result.error) {
            this.props.setMessage(result.package + " : " + result.message)
        } else {
            this.setState({ loading: false, process: result.data, open: false, inputs: [] })
        }
    }

    onClick() {
        switch (this.props.mode) {
            case "view":
                this.checkAction()
                break
            case "edit":

                break
            case "delete":
                this.props.onDelete()
                break
        }
    }

    async executeAction() {
        let resetState = {}
        let tmp = {}
        for (let index = 0; index < this.state.process.inputs.length; index++) {
            let input = this.state.process.inputs[index];
            let value = this.state[input.id]
            resetState[input.id] = null
            if (value) {
                tmp[input.reference] = value
            } else {
                tmp[input.reference] = null
            }
        }
        this.setState({ open: false })
        let result = await new Request().post({ inputs: tmp }).fetch("/api/processes/" + this.state.process.id + "/execute")
        if (result.error) {
            this.props.setMessage(result.package + " : " + result.message)
        } else {
            this.setState(resetState)
            this.componentDidMount()
        }
    }

    checkAction() {
        let inputs = this.state.process.inputs.filter(input => input.state == this.state.process.state)
        if (inputs.length == 0) {
            this.executeAction()
        } else {
            this.setState({
                inputs: inputs,
                open: true
            })
        }
    }

    render() {
        if (this.state.loading) {
            return (
                <Box style={{ height: '100%', width: '100%' }}>
                    <Skeleton style={{ height: '100%', width: '100%' }} />
                </Box>
            )
        }
        return (
            <>
                <Modal onClose={() => { this.setState({ open: false }) }} open={this.state.open}>
                    <Card variant='outlined' style={{ padding: 10, position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', width: 300 }}>
                        <Grid container spacing={1}>
                        {
                            this.state.process.inputs.filter(input => input.state == this.state.process.state).map((input, index) => {
                                return (
                                    <Grid item xs={12} md={12} lg={12}>
                                        <Action options={input.options} label={String.capitalizeFirstLetter(input.reference.split("_")[0])} setState={this.setState.bind(this)} id={input.id} action={input} />
                                    </Grid>
                                )
                            })
                        }

                        </Grid>
                        <Button onClick={() => {this.executeAction()}} size='large' style={{ width: '50%', marginTop: 12 }} variant='contained'>
                            <Typography variant='body2' >
                                {String.capitalizeFirstLetter(
                                    this.state.process.mode == "switch" ?
                                        this.state.process.state == "on" ?
                                            this.state.process.description_on :
                                            this.state.process.description_off
                                        :
                                        this.state.process.description_on)}
                            </Typography>
                        </Button>
                    </Card>
                </Modal>
                <Button variant='contained' onClick={() => this.onClick()} color={'primary'} style={{ backgroundColor: '#00afff82', textTransform: 'none', textAlign: 'center', width: '100%', height: '100%', padding: 10, display: 'flex', flexDirection: 'column' }}>
                    <Typography variant='caption' color="text.secondary" >
                        {String.capitalizeFirstLetter(this.state.process.description)}
                    </Typography>
                    <Typography variant='h6'  >
                        {
                            String.capitalizeFirstLetter(
                                this.state.process.mode == "switch" ?
                                    this.state.process.state == "on" ?
                                        this.state.process.description_on :
                                        this.state.process.description_off
                                    :
                                    this.state.process.description_on)
                        }
                    </Typography>
                </Button>
            </>
        )
    }

}

export default Process