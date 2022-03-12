import React from 'react'
import { Typography, Paper, Grid, Card, Box, CardActionArea } from '@mui/material'
import * as AbstractIcon from '@mui/icons-material'
import Request from '../../utils/Request'
import Desktop from '../../components/Desktop'


import AddButton from '../../components/views/AddButton'
import Loading from '../../components/Loading'

class Home extends React.Component {

    constructor(props) {
        super(props)
        this.state = {
            page: 0,
            loading: true,
            rooms: [],
            open: false,
            widget: {
                id: -1
            }
        }
        props.setTitle("Room")
        props.setActionType("list")
    }

    async componentDidMount() {
        let result = await new Request().get().fetch("/api/rooms")
        if (result.error) {
            this.props.setMessage(result.package + " : " + result.message)
        } else {
            this.setState({ rooms: result.data, loading: false })
        }
    }

    render() {
        return (
            <>
                <Desktop {... this.props}>
                    <Paper variant='outlined' style={{ padding: 12, justifyContent: 'left'}}>
                        <Typography variant='h6' fontWeight='bold'  >
                            {"Home"}
                        </Typography>
                    </Paper>
                </Desktop>
                <Loading loading={this.state.loading}>
                    <Grid container spacing={1} style={{marginTop: 0}}>
                    </Grid>
                </Loading>
            </>
        )
    }
}

export default Home