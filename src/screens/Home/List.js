import React from 'react'
import { Typography, Paper, Grid, Card, Button } from '@mui/material'
import Desktop from '../../components/Desktop'
import Loading from '../../components/Loading'
import { Responsive, WidthProvider } from "react-grid-layout";
import Request from '../../utils/Request'
import { Delete, Edit, Save } from '@mui/icons-material';
import AddButton from '../../components/views/AddButton'
import Smartobject from '../../components/dashboard/Smartobject'
import Process from '../../components/dashboard/Process';
import Rapport from '../../components/dashboard/Rapport';
import Widget from '../../components/dashboard/Widget';


const ResponsiveReactGridLayout = WidthProvider(Responsive);

class Home extends React.Component {


    constructor(props) {
        super(props)
        this.state = {
            loading: true,
            mode: "view",
            currentBreakpoint: "lg",
            dashboards: [],
            layouts: {
                lg: [],
                md: [],
                sm: [],
                xs: [],
                xxs: []
            },
        }
        props.setTitle("Home")
        props.setActionType("list")
    }

    async componentDidMount() {
        let idUser = localStorage.getItem("user")
        let result = await new Request().get().fetch("/api/users/" + idUser)
        if (result.error) {
            this.props.setMessage(result.package + " : " + result.message)
        } else {

            this.setState({ loading: false, dashboards: result.data.dashboards }, () => {
                this.setState({
                    layouts: this.newLayout()
                })
            })
        }
    }

    newLayout() {
        return {
            lg: this.state.dashboards.map((dashboard, index) => {
                let width = this.getWidth(dashboard.type,"lg")
                return {
                    x: parseInt(dashboard.x),
                    y: parseInt(dashboard.y),
                    w: width.w,
                    h: width.h,
                    i: index,
                    isResizable: false,
                    static: this.state.mode == "view",
                }
            }),
            md: this.state.dashboards.map((dashboard, index) => {
                let width = this.getWidth(dashboard.type,"md")
                return {
                    x: parseInt(dashboard.x),
                    y: parseInt(dashboard.y),
                    w: width.w,
                    h: width.h,
                    i: index,
                    isResizable: false,
                    static: this.state.mode == "view",
                }
            }),
            sm: this.state.dashboards.map((dashboard, index) => {
                let width = this.getWidth(dashboard.type,"sm")
                return {
                    x: parseInt(dashboard.x),
                    y: parseInt(dashboard.y),
                    w: width.w,
                    h: width.h,
                    i: index,
                    isResizable: false,
                    static: this.state.mode == "view",
                }
            }),
            xs: this.state.dashboards.map((dashboard, index) => {
                let width = this.getWidth(dashboard.type,"xs")
                return {
                    x: parseInt(dashboard.x),
                    y: parseInt(dashboard.y),
                    w: width.w,
                    h: width.h,
                    i: index,
                    isResizable: false,
                    static: this.state.mode == "view",
                }
            }),
            xxs: this.state.dashboards.map((dashboard, index) => {
                let width = this.getWidth(dashboard.type,"xxs")
                return {
                    x: parseInt(dashboard.x),
                    y: parseInt(dashboard.y),
                    w: width.w,
                    h: width.h,
                    i: index,
                    isResizable: false,
                    static: this.state.mode == "view",
                }
            })
        }
    }

    updateLayout() {
        let newLayout = {
            lg: this.state.layouts.lg.map((layout) => {
                layout.static = this.state.mode != "edit"
                return layout
            }),
            md: this.state.layouts.md.map((layout) => {
                layout.static = this.state.mode != "edit"
                return layout
            }),
            sm: this.state.layouts.sm.map((layout) => {
                layout.static = this.state.mode != "edit"
                return layout
            }),
            xs: this.state.layouts.xs.map((layout) => {
                layout.static = this.state.mode != "edit"
                return layout
            }),
            xxs: this.state.layouts.xxs.map((layout) => {
                layout.static = this.state.mode != "edit"
                return layout
            })
        }
        this.setState({
            layouts: {
                lg: [],
                md: [],
                sm: [],
                xs: [],
                xxs: []
            }
        }, () => {
            this.setState({
                layouts: newLayout
            }, () => {
                if (this.state.mode == "view") {
                    this.state.layouts[this.state.currentBreakpoint].forEach(async (layout) => {
                        let idUser = localStorage.getItem("user")
                        await new Request().post({
                            x: layout.x,
                            y: layout.y
                        }).fetch("/api/users/" + idUser + "/dashboards/" + this.state.dashboards[layout.i].id)
                    })
                }
            })
        })
        return
    }

    getWidth(type,breakpointType) {
        switch (type) {
            case "smartobject":
                return {
                    w: 4,
                    h: 2
                }
            case "process":
                return {
                    w: 4,
                    h: 2
                }
            case "rapport":
                return {
                    w: 2,
                    h: 2
                }
            case "widget":
                return {
                    w: 4,
                    h: 4
                }
        }
    }

    async delete(idUserDashboard) {
        let idUser = localStorage.getItem("user")
        let result = await new Request().delete().fetch("/api/users/" + idUser + "/dashboards/" + idUserDashboard)
        if (result.error) {
            this.props.setMessage(result.package + " : " + result.message)
        } else {
            this.setState({
                layouts: {
                    lg: [],
                    md: [],
                    sm: [],
                    xs: [],
                    xxs: []
                },
                mode: "view"
            }, () => {
                this.componentDidMount()
            })
        }
    }

    getView(layout) {
        let source = this.state.dashboards[layout.i]
        switch (source.type) {
            case "smartobject":
                return <Smartobject onDelete={() => {
                    this.delete(this.state.dashboards[layout.i].id)
                }} mode={this.state.mode} setMessage={this.props.setMessage} source={source} />
            case "process":
                return <Process onDelete={() => {
                    this.delete(this.state.dashboards[layout.i].id)
                }} mode={this.state.mode} setMessage={this.props.setMessage} source={source} />
            case "rapport":
                return <Rapport onDelete={() => {
                    this.delete(this.state.dashboards[layout.i].id)
                }} mode={this.state.mode} setMessage={this.props.setMessage} source={source} />
            case "widget":
                return <Widget onDelete={() => {
                    this.delete(this.state.dashboards[layout.i].id)
                }} mode={this.state.mode} setMessage={this.props.setMessage} source={source} />
            default:
                break;
        }
    }

    render() {
        return (
            <>

                <Desktop isMobile={this.props.isMobile}>
                    <Paper variant="outlined" style={{ padding: 12, justifyContent: 'left', marginBottom: 8 }}>
                        <Typography variant='h6' fontWeight='bold' >Dashboard</Typography>
                        <Typography variant='subtitle2' color="text.secondary" >Well at home</Typography>
                    </Paper>
                </Desktop>
                <Loading loading={this.state.loading}>
                    <Grid container spacing={1} >
                        {
                            this.state.dashboards.length > 0 &&
                            <Grid item xs={12} md={12} lg={12}>
                                <Card variant='outlined' style={{ width: '100%' }}>
                                    <div>
                                        <ResponsiveReactGridLayout
                                            onBreakpointChange={(breakpoint) => {
                                                this.setState({ currentBreakpoint: breakpoint })
                                            }}
                                            className="layout"
                                            onLayoutChange={(layouts) => {
                                                let currentLayouts = this.state.layouts
                                                currentLayouts[this.state.currentBreakpoint] = layouts
                                                this.setState({
                                                    layouts: currentLayouts
                                                })
                                            }}
                                            preventCollision={true}
                                            rowHeight={30}
                                            useCSSTransforms={true}
                                            compactType={null}
                                            measureBeforeMount={false}
                                            cols={{ lg: 16, md: 14, sm: 12, xs: 8, xxs: 4 }}
                                        >
                                            {
                                                this.state.layouts[this.state.currentBreakpoint].map((layout, index) => {
                                                    return (
                                                        <Card data-grid={layout} style={{ borderWidth: '0px' }} variant='outlined' key={"" + layout.i} >
                                                            {
                                                                this.getView(layout)
                                                            }
                                                        </Card>
                                                    )
                                                })
                                            }
                                        </ResponsiveReactGridLayout>
                                    </div>
                                </Card>
                            </Grid>
                        }
                        <AddButton xs={2} md={1} lg={1} to="/dashboard/new" />
                        <Grid item xs={10} md={11} lg={11} style={{ display: 'flex', justifyContent: 'flex-end' }}>
                            <Paper variant='outlined'>
                                <Button color={this.state.mode == "edit" ? 'error' : 'primary'} onClick={() => { this.setState({ mode: this.state.mode == "view" ? "edit" : "view" }, () => { this.updateLayout() }) }} variant='contained' style={{ height: '100%', width: '100%' }}>
                                    {this.state.mode == "edit" ? <Save /> : <Edit />}
                                </Button>
                            </Paper>
                            <Paper variant='outlined' style={{ marginLeft: 12 }} >
                                <Button color={this.state.mode == "delete" ? 'error' : 'primary'} onClick={() => { this.setState({ mode: this.state.mode == "delete" ? "view" : "delete" }, () => { this.updateLayout() }) }} variant='contained' style={{ height: '100%', width: '100%' }}>
                                    <Delete />
                                </Button>
                            </Paper>
                        </Grid>
                    </Grid>
                </Loading>
            </>
        )
    }
}

export default Home