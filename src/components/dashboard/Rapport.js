import React from 'react'
import Request from '../../utils/Request'
import { Typography, Skeleton, CardActionArea, Box, Button } from '@mui/material'

class Rapport extends React.Component {

    constructor(props) {
        super(props)
        this.state = {
            loading: true,
            rapport: {}
        }
    }

    async componentDidMount() {
        this.setState({loading: true})
        let result = await new Request().get().fetch("/api/rapports/" + this.props.source.object)
        if (result.error) {
            this.props.onDelete()
            this.props.setMessage(result.package + " : " + result.message)
        } else {
            this.setState({ loading: false, rapport: result.data })
        }
    }

    onClick() {
        switch (this.props.mode) {
            case "view":
                this.componentDidMount()
                break
            case "edit":
                
                break
            case "delete":
                this.props.onDelete()
                break
        }
    }

    render() {
        if (this.state.loading) {
            return (
                <Box style={{height: '100%', width: '100%'  }}>
                    <Skeleton style={{height: '100%', width: '100%'  }} />
                </Box>
            )
        }

        let unit = ""

        this.state.rapport.configuration.dataSources.forEach(dataSource => {
            if(dataSource.id == this.state.rapport.reference) {
                unit = dataSource.unit
            }
        })


        return (
            <Button variant='contained'   onClick={() => this.onClick()} style={{backgroundColor:'rgba(0, 255, 12, 0.47)', textAlign:'center', width: '100%', height: '100%',borderColor:'white', padding: 10, display: 'flex', flexDirection: 'column' }}>
                <Typography variant='body2' color="rgba(255,255,255,0.7)"  >
                    {String.capitalizeFirstLetter(this.state.rapport.smartobject.reference)}
                </Typography>
                <Typography variant='h5' color="white"  >
                    {String.capitalizeFirstLetter(this.state.rapport.lastData.value +" " + unit)}
                </Typography>
            </Button>
        )
    }

}

export default Rapport