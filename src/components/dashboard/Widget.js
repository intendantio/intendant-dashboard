import React from 'react'
import Request from '../../utils/Request'
import { Typography, Skeleton, Box, Button } from '@mui/material'

class Widget extends React.Component {

    constructor(props) {
        super(props)
        this.state = {
            loading: true,
            widget: {}
        }
    }

    async componentDidMount() {
        this.setState({loading: true})
        let result = await new Request().get().fetch("/api/widgets/" + this.props.source.object)
        if (result.error) {
            this.props.setMessage(result.package + " : " + result.message)
        } else {
            this.setState({ loading: false, widget: result.data })
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
                <Box style={{ height: '100%', width: '100%' }}>
                    <Skeleton style={{ height: '100%', width: '100%' }} />
                </Box>
            )
        }
        return (
            <Button variant='contained' onClick={() => this.onClick()} style={{backgroundColor:'rgba(255, 17, 0, 0.46)', textTransform: 'none', textAlign: 'center', width: '100%', height: '100%', padding: 10, display: 'flex', flexDirection: 'column' }}>
                {
                    this.state.widget.values.filter(value => value.type == "title").map((value, ppIndex) => {
                        return (
                            <Typography key={ppIndex} variant='subtitle1' component='div'>
                                {String.capitalizeFirstLetter(value.value)}
                            </Typography>
                        )
                    })
                }
                {
                    this.state.widget.values.filter(value => value.type == "text").map((value, ppIndex) => {
                        return (
                            <Typography key={ppIndex} variant='body2' color={value.style && value.style.color ? this.state.widget.dataSources[value.style.color] : "text.secondary"}>
                                {String.capitalizeFirstLetter(value.value)}
                            </Typography>
                        )
                    })
                }
            </Button>
        )
    }

}

export default Widget