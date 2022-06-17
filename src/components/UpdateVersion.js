import React from 'react'
import { Typography, Skeleton, Grid, Card, Button, Box, Divider, Pagination } from '@mui/material'
import Request from '../utils/Request'

class SmartobjectVersion extends React.Component {

    constructor(props) {
        super(props)
        this.state = {
            isError: false,
            isUpdate: false,
            isLoading: true,
            currentVersion: "0.0.0",
            newVersion: "0.0.0"
        }
    }

    componentDidMount() {
        this.setState({isLoading: true})
        let currentSmartobject = false
        this.props.smartobjects.forEach(smartobject => {
            if(smartobject.name == this.props.package[1].name) {
                currentSmartobject = smartobject
            }
        })
        if(currentSmartobject) {
            if(this.props.package[1].version == currentSmartobject.version) {
                this.setState({
                    currentVersion: this.props.package[1].version,
                    newVersion: currentSmartobject.version,
                    isUpdate: true
                })
            } else {
                this.setState({
                    currentVersion: this.props.package[1].version,
                    newVersion: currentSmartobject.version,
                    isUpdate: false
                })
            }
        } else {
            this.setState({ isError: true })
        }
        this.setState({isLoading: false})
    }

    
    async updateVersion() {
        this.setState({isLoading: true})
        await new Request().patch({package: this.props.package[0]}).fetch("/api/smartobjects")
        this.props.onRefresh()
    }

    render() {
        return (
            <Box flexDirection='row' style={{ display: 'flex', alignItems:'center' }}>
                    {
                        this.state.isLoading ?
                        <Skeleton width={100} height={50} />
                        :
                        this.state.isError ?
                        <Button style={{marginTop: 7, marginBottom: 7, width: 100}} variant='contained' size='small' color='error' onClick={() => {  this.updateVersion() }}>
                            <Typography textAlign='center' style={{ color: 'white' }} variant='subtitle1'>{String.capitalizeFirstLetter("fix")}</Typography>
                        </Button> : 
                        this.state.isUpdate ?
                        <Button style={{marginTop: 7, marginBottom: 7, width: 100}} variant='contained' size='small' color='primary' onClick={() => { this.updateVersion() }}>
                            <Typography textAlign='center' style={{ color: 'white' }} variant='subtitle1'>{String.capitalizeFirstLetter("latest")}</Typography>
                        </Button>
                        :
                        <Button style={{marginTop: 7, marginBottom: 7, width: 100}} variant='contained' size='small' color='success' onClick={() => { this.updateVersion() }}>
                            <Typography textAlign='center' style={{ color: 'white' }} variant='subtitle1'>{String.capitalizeFirstLetter("upgrade")}</Typography>
                        </Button>
                    }
                    
                    <Typography style={{ marginLeft: 12, width: 110 }} color='text.secondary' variant='body1' >{this.state.currentVersion + " ~> " + this.state.newVersion}</Typography>
                    <Typography style={{ marginLeft: 12 }} color='text.secondary' variant='body1' >{this.props.package[0]}</Typography>
             </Box>
        )
    }

}

export default SmartobjectVersion

