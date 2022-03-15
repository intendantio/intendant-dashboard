import React, { lazy, Suspense } from 'react'
const Smartobject = lazy(() => import('./Smartobject/List'))
const DetailSmartObject = lazy(() => import('./Smartobject/Detail'))
const GallerySmartobject = lazy(() => import('./Smartobject/Gallery'))
const NewSmartObject = lazy(() => import('./Smartobject/New'))
const ListProcess = lazy(() => import('./Process/List'))
const NewProcess = lazy(() => import('./Process/New'))
const DetailProcess = lazy(() => import('./Process/Detail'))
const Automation = lazy(() => import('./Automation/List'))
const NewAutomation = lazy(() => import('./Automation/New'))
const Module = lazy(() => import('./Module/List'))
const DetailModule = lazy(() => import('./Module/Detail'))
const GalleryModule = lazy(() => import('./Module/Gallery'))
const Widget = lazy(() => import('./Widget/List'))
const NewWidget = lazy(() => import('./Widget/New'))
const Rapport = lazy(() => import('./Rapport/List'))
const NewRapport = lazy(() => import('./Rapport/New'))
const DetailRapport = lazy(() => import('./Rapport/Detail'))
const User = lazy(() => import('./User/List'))
const NewUser = lazy(() => import('./User/New'))
const DetailUser = lazy(() => import('./User/Detail'))
const Room = lazy(() => import('./Room/List'))
const NewRoom = lazy(() => import('./Room/New'))
const DetailRoom = lazy(() => import('./Room/Detail'))
const OAuthSmartobject = lazy(() => import('./Smartobject/OAuth'))
const Home = lazy(() => import('./Home/List'))
const Authorisation = lazy(() => import('./Authorisation/List'))
const NewHome = lazy(() => import('./Home/New'))

import Sidebar from '../components/Sidebar'
import Context from '../utils/Context'


import { Grid, Card, Skeleton } from '@mui/material'

import { BrowserRouter as Router, Switch, Route, useHistory, } from "react-router-dom"
import Desktop from '../components/Desktop'
import System from './System/List'

const renderLoader = (props) => {
    return (
        <>
            <Desktop isMobile={props.isMobile}>
                <Card variant='outlined' style={{ padding: 10, marginBottom: 8 }}>
                    <Grid container >
                        <Grid item xs={12} md={12} lg={12} style={{ paddingLeft: 3, paddingRight: 3 }}>
                            <Skeleton height={35} />
                            <Skeleton height={22} />
                        </Grid>
                    </Grid>
                </Card>
            </Desktop>
            <Card variant='outlined' style={{ padding: 10, marginTop: 8 }}>
                <Grid container >
                    <Grid item xs={12} md={4} lg={4} style={{ paddingLeft: 5, paddingRight: 5 }}>
                        <Skeleton height={35} />
                        <Skeleton height={35} />
                        <Skeleton height={35} />
                    </Grid>
                    <Grid item xs={12} md={4} lg={4} style={{ paddingLeft: 5, paddingRight: 5 }}>
                        <Skeleton height={35} />
                        <Skeleton height={35} />
                        <Skeleton height={35} />
                    </Grid>
                    <Grid item xs={12} md={4} lg={4} style={{ paddingLeft: 5, paddingRight: 5 }}>
                        <Skeleton height={35} />
                        <Skeleton height={35} />
                        <Skeleton height={35} />
                    </Grid>
                </Grid>
            </Card>
        </>
    )
}

function Main(mainProps) {


    return (
        <Context.Consumer>
            {({ title, setTitle, setActionType, actionType, setMessage }) => (
                <Router basename='/'>
                    <Sidebar title={title} actionType={actionType} isMobile={mainProps.isMobile} onDisconnect={() => { mainProps.onDisconnect() }} />
                    <main id='main' style={{ paddingTop: mainProps.isMobile ? 8 : '4vh', height: '100%', width: '100vw', paddingLeft: '5vw', paddingRight: '5vw', overflowX: 'hidden', overflowY: 'visible' }} >
                        <div style={{ marginLeft: mainProps.isMobile ? 0 : 240, marginBottom: 12 }}>
                            <Suspense fallback={renderLoader(mainProps)}>
                                <Switch>
                                    <Route exact path="/" render={(props) => <Home setMessage={setMessage} setTitle={setTitle} setActionType={setActionType} isMobile={mainProps.isMobile} {...props} />} />
                                    <Route exact path="/dashboard/new" render={(props) => <NewHome setMessage={setMessage} setTitle={setTitle} setActionType={setActionType} isMobile={mainProps.isMobile} {...props} />} />
                                    <Route exact path="/smartobject/oauth/:id" render={(props) => <OAuthSmartobject setActionType={setActionType} setMessage={setMessage} setTitle={setTitle} isMobile={mainProps.isMobile} {...props} />} />
                                    <Route exact path="/system" render={(props) => <System setActionType={setActionType} setMessage={setMessage} setTitle={setTitle} isMobile={mainProps.isMobile} {...props} />} />
                                    <Route exact path="/module" render={(props) => <Module setActionType={setActionType} setMessage={setMessage} setTitle={setTitle} isMobile={mainProps.isMobile} {...props} />} />
                                    <Route exact path="/module/gallery" render={(props) => <GalleryModule setActionType={setActionType} setMessage={setMessage} setTitle={setTitle} isMobile={mainProps.isMobile} {...props} />} />
                                    <Route exact path="/module/:id" render={(props) => <DetailModule setActionType={setActionType} setMessage={setMessage} setTitle={setTitle} isMobile={mainProps.isMobile} {...props} />} />
                                    <Route exact path="/automation" render={(props) => <Automation setActionType={setActionType} setMessage={setMessage} setTitle={setTitle} isMobile={mainProps.isMobile} {...props} />} />
                                    <Route exact path="/automation/new" render={(props) => <NewAutomation setActionType={setActionType} setMessage={setMessage} setTitle={setTitle} isMobile={mainProps.isMobile} {...props} />} />
                                    <Route exact path="/rapport" render={(props) => <Rapport setActionType={setActionType} setMessage={setMessage} setTitle={setTitle} isMobile={mainProps.isMobile} {...props} />} />
                                    <Route exact path="/rapport/new" render={(props) => <NewRapport setActionType={setActionType} setMessage={setMessage} setTitle={setTitle} isMobile={mainProps.isMobile} {...props} />} />
                                    <Route exact path="/rapport/:id" render={(props) => <DetailRapport setActionType={setActionType} setMessage={setMessage} setTitle={setTitle} isMobile={mainProps.isMobile} {...props} />} />
                                    <Route exact path="/widget" render={(props) => <Widget setActionType={setActionType} setMessage={setMessage} setTitle={setTitle} isMobile={mainProps.isMobile} {...props} />} />
                                    <Route exact path="/widget/new" render={(props) => <NewWidget setActionType={setActionType} setMessage={setMessage} setTitle={setTitle} isMobile={mainProps.isMobile} {...props} />} />
                                    <Route exact path="/process" render={(props) => <ListProcess setActionType={setActionType} setMessage={setMessage} setTitle={setTitle} isMobile={mainProps.isMobile} {...props} />} />
                                    <Route exact path="/process/new" render={(props) => <NewProcess setActionType={setActionType} setMessage={setMessage} setTitle={setTitle} isMobile={mainProps.isMobile} {...props} />} />
                                    <Route exact path="/process/:id" render={(props) => <DetailProcess setActionType={setActionType} setMessage={setMessage} setTitle={setTitle} isMobile={mainProps.isMobile} {...props} />} />
                                    <Route exact path="/user" render={(props) => <User setActionType={setActionType} setMessage={setMessage} setTitle={setTitle} isMobile={mainProps.isMobile} {...props} />} />
                                    <Route exact path="/user/new" render={(props) => <NewUser setActionType={setActionType} setMessage={setMessage} setTitle={setTitle} isMobile={mainProps.isMobile} {...props} />} />
                                    <Route exact path="/user/:id" render={(props) => <DetailUser setActionType={setActionType} setMessage={setMessage} setTitle={setTitle} isMobile={mainProps.isMobile} {...props} />} />
                                    <Route exact path="/room" render={(props) => <Room setActionType={setActionType} setMessage={setMessage} setTitle={setTitle} isMobile={mainProps.isMobile} {...props} />} />
                                    <Route exact path="/room/new" render={(props) => <NewRoom setActionType={setActionType} setMessage={setMessage} setTitle={setTitle} isMobile={mainProps.isMobile} {...props} />} />
                                    <Route exact path="/room/:id/smartobject/new/:idSmartobject" render={(props) => <NewSmartObject setActionType={setActionType} setMessage={setMessage} setTitle={setTitle} isMobile={mainProps.isMobile} {...props} />} />
                                    <Route exact path="/room/:id/smartobject/gallery" render={(props) => <GallerySmartobject setActionType={setActionType} setMessage={setMessage} setTitle={setTitle} isMobile={mainProps.isMobile} {...props} />} />
                                    <Route exact path="/room/:id/smartobject/:idSmartobject" render={(props) => <DetailSmartObject setActionType={setActionType} setMessage={setMessage} setTitle={setTitle} isMobile={mainProps.isMobile} {...props} />} />
                                    <Route exact path="/room/:id" render={(props) => <DetailRoom setActionType={setActionType} setMessage={setMessage} setTitle={setTitle} isMobile={mainProps.isMobile} {...props} />} />
                                    <Route exact path="/authorisation" render={(props) => <Authorisation setActionType={setActionType} setMessage={setMessage} setTitle={setTitle} isMobile={mainProps.isMobile} {...props} />} />
                                </Switch>
                            </Suspense>
                        </div>
                    </main>
                </Router>
            )}
        </Context.Consumer>

    )
}

export default Main