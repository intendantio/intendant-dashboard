import React from 'react'
import Request from '../../utils/Request'

import { Grid, Card, Step, StepLabel, Stepper, Typography, Paper, CardActionArea } from '@mui/material'
import Loading from '../../components/Loading'
import Utils from '../../utils/Utils'
import Desktop from '../../components/Desktop'

class New extends React.Component {

    constructor(props) {
        super(props)
        this.state = {
            loading: false,
            step: 0,
            type: "",
            dbType: "",
            name: "",
            actions: [],
            source: {},
            sources: []
        }
        props.setTitle("New item")
        props.setActionType("return")
    }

    async loadSource() {
        let result = await new Request().get().fetch("/api/" + this.state.type)
        if (result.error) {
            this.props.setMessage(result.package + " : " + result.message)
        } else {
            this.setState({ loading: false, sources: result.data })
        }
    }

    async addSource(source) {
        if (this.state.dbType == "smartobject" || this.state.dbType == "module") {
            this.setState({ step: 2, source: source, actions: source.actions })
        } else if (this.state.dbType == "process") {
            await this.save(this.state.dbType, source.id, "process")
        } else if (this.state.dbType == "widget") {
            await this.save(this.state.dbType, source.id, "widget")
        } else if (this.state.dbType == "rapport") {
            await this.save(this.state.dbType, source.id, "rapport")
        }

        /*let result = await new Request().post({
            user: idUser,
            type: this.state.dbType,
            object: this.state.dbType,
            action: this.state.dbType,
            x: 0,
            y: 0
        }).fetch("/api/users/" + idUser + "/dashboards")
        if (result.error) {
            this.props.setMessage(result.package + " : " + result.message)
        } else {
            this.props.history.push('/')
        }*/
    }

    async save(type, object, action) {
        let idUser = localStorage.getItem("user")
        let result = await new Request().post({
            user: idUser,
            type: type,
            object: object,
            action: action,
            x: 0,
            y: 0
        }).fetch("/api/users/" + idUser + "/dashboards")
        if (result.error) {
            this.props.setMessage(result.package + " : " + result.message)
        } else {
            this.props.history.push('/')
        }
    }

    getStep() {
        switch (this.state.step) {
            case 0:
                return (
                    <>
                        <Grid item xs={12} md={12} lg={12} >
                            <Card variant='outlined'   >
                                <CardActionArea onClick={() => { this.setState({ name: "reference", type: "smartobjects", dbType: "smartobject", step: 1, loading: true }, () => { this.loadSource() }) }} style={{ padding: 10 }} >
                                    <Typography variant='subtitle1'  >
                                        {String.capitalizeFirstLetter("Smartobject")}
                                    </Typography>
                                </CardActionArea>
                            </Card>
                        </Grid>
                        <Grid item xs={12} md={12} lg={12} >
                            <Card variant='outlined'   >
                                <CardActionArea onClick={() => { this.setState({ name: "description", type: "processes", dbType: "process", step: 1, loading: true }, () => { this.loadSource() }) }} style={{ padding: 10 }} >
                                    <Typography variant='subtitle1'  >
                                        {String.capitalizeFirstLetter("Process")}
                                    </Typography>
                                </CardActionArea>
                            </Card>
                        </Grid>
                        <Grid item xs={12} md={12} lg={12} >
                            <Card variant='outlined'   >
                                <CardActionArea onClick={() => { this.setState({ name: "reference", type: "widgets", dbType: "widget", step: 1, loading: true }, () => { this.loadSource() }) }} style={{ padding: 10 }} >
                                    <Typography variant='subtitle1'  >
                                        {String.capitalizeFirstLetter("Widget")}
                                    </Typography>
                                </CardActionArea>
                            </Card>
                        </Grid>
                        <Grid item xs={12} md={12} lg={12} >
                            <Card variant='outlined'   >
                                <CardActionArea onClick={() => { this.setState({ name: "reference", type: "rapports", dbType: "rapport", step: 1, loading: true }, () => { this.loadSource() }) }} style={{ padding: 10 }} >
                                    <Typography variant='subtitle1'  >
                                        {String.capitalizeFirstLetter("Rapport")}
                                    </Typography>
                                </CardActionArea>
                            </Card>
                        </Grid>
                    </>
                )
            case 1:
                return this.state.sources.map((source, index) => {
                    let title = ""
                    let description = ""
                    if (this.state.type == "rapports") {
                        title = String.capitalizeFirstLetter(source.smartobject.reference) + " - " + String.capitalizeFirstLetter(source.reference)
                        description = String.capitalizeFirstLetter(source.smartobject.room.name)
                    } else if (this.state.type == "smartobjects") {
                        title = String.capitalizeFirstLetter(source.reference)
                        description = source.room ? String.capitalizeFirstLetter(source.room.name) : ""
                    } else if (this.state.type == "processes") {
                        title = String.capitalizeFirstLetter(source.description)
                        description = ""
                    } else if (this.state.type == "modules") {
                        title = String.capitalizeFirstLetter(source.name)
                        description = source.mode == "button" ? source.description_on : source.description_on + " / " + source.description_off
                    } else if (this.state.type == "widgets") {
                        title = source.values.filter(value => value.type == "title").map((value, ppIndex) => {
                            return (
                                <Typography key={ppIndex} variant='subtitle1' component='div'>
                                    {String.capitalizeFirstLetter(value.value)}
                                </Typography>
                            )
                        })
                        description = ""
                    }
                    return (
                        <Grid key={index} item xs={12} md={12} lg={12} >
                            <Card variant='outlined'   >
                                <CardActionArea onClick={() => { this.addSource(source) }} style={{ padding: 10 }} >
                                    <Typography variant='subtitle1' >
                                        {title}
                                    </Typography>
                                    <Typography variant='body2' color="text.secondary"  >
                                        {description}
                                    </Typography>
                                </CardActionArea>
                            </Card>
                        </Grid>
                    )
                })

            case 2:
                return this.state.actions.map((source, index) => {
                    return (
                        <Grid key={index} item xs={12} md={12} lg={12} >
                            <Card variant='outlined'   >
                                <CardActionArea onClick={() => { this.save(this.state.dbType, this.state.source.id, source.id) }} style={{ padding: 10 }} >
                                    <Typography variant='subtitle1' >
                                        {source.name}
                                    </Typography>
                                </CardActionArea>
                            </Card>
                        </Grid>
                    )
                })
        }
    }

    async submit() {

        let settings = []
        let resetState = {}
        for (let indexSettings = 0; indexSettings < this.state.settings.length; indexSettings++) {
            let setting = this.state.settings[indexSettings]
            resetState["rapport-" + setting.id] = null
            settings.push({
                reference: setting.id,
                value: this.state["rapport-" + setting.id] ? this.state["rapport-" + setting.id] : null,
                type: typeof this.state["rapport-" + setting.id]
            })
        }
        let result = await new Request().post({
            reference: this.state.reference,
            chart: this.state.type,
            interval: this.state.interval,
            type: this.state.configuration.configuration.module,
            object: this.state.configuration.configuration.module == "smartobject" ? this.state.configuration.id : Utils.getSum(this.state.configuration.name),
            settings: settings
        }).fetch("/api/rapports")

        if (result.error) {
            this.props.setMessage(result.package + " : " + result.message)
        } else {
            document.getElementById('main').scroll({
                top: 0,
                left: 0
            })
            this.props.history.push('/rapport')
        }
    }


    render() {
        return (
            <>
                <Desktop isMobile={this.props.isMobile}>
                    <Paper variant="outlined" style={{ padding: 12, justifyContent: 'left' }}>
                        <Typography variant='h6' fontWeight='bold' >New item</Typography>
                    </Paper>
                </Desktop>
                <Card variant='outlined' style={{ padding: 10, marginTop: 8 }}>
                    <Stepper activeStep={this.state.step} >
                        <Step key={"type"}>
                            <StepLabel>{"Type"}</StepLabel>
                        </Step>
                        <Step key={"source"}>
                            <StepLabel>{"Source"}</StepLabel>
                        </Step>
                    </Stepper>
                </Card>
                <Loading loading={this.state.loading}>
                    <Grid container spacing={1} style={{ marginTop: 0 }} >
                        {this.getStep()}
                    </Grid>
                </Loading>
            </>
        )
    }
}

export default New