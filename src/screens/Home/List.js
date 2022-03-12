import React from 'react'
import { Typography, Paper, Grid } from '@mui/material'
import Desktop from '../../components/Desktop'
import Loading from '../../components/Loading'

class Home extends React.Component {

    constructor(props) {
        super(props)
        this.state = {
            loading: false
        }
        props.setTitle("Home")
        props.setActionType("list")
    }

    render() {
        return (
            <>
                <Desktop {... this.props}>
                    <Paper variant='outlined' style={{ padding: 12, justifyContent: 'left' }}>
                        <Typography variant='h6' fontWeight='bold'  >
                            {"Home"}
                        </Typography>
                    </Paper>
                </Desktop>
                <Loading loading={this.state.loading}>
                    <Grid container spacing={1} style={{ marginTop: 0 }}>
                    </Grid>
                </Loading>
            </>
        )
    }
}

export default Home