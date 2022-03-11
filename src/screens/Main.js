import React, { lazy, Suspense } from 'react'
const Smartobject = lazy(() => import('./contents/Smartobject/List'))
const DetailSmartObject = lazy(() => import('./contents/Smartobject/Detail'))
const GallerySmartobject = lazy(() => import('./contents/Smartobject/Gallery'))
const NewSmartObject = lazy(() => import('./contents/Smartobject/New'))
const ListProcess = lazy(() => import('./contents/Process/List'))
const NewProcess = lazy(() => import('./contents/Process/New'))
const DetailProcess = lazy(() => import('./contents/Process/Detail'))
const Automation = lazy(() => import('./contents/Automation/List'))
const NewAutomation = lazy(() => import('./contents/Automation/New'))
const DetailAutomation = lazy(() => import('./contents/Automation/Detail'))
const Module = lazy(() => import('./contents/Module/List'))
const DetailModule = lazy(() => import('./contents/Module/Detail'))
const GalleryModule = lazy(() => import('./contents/Module/Gallery'))
const Widget = lazy(() => import('./contents/Widget/List'))
const NewWidget = lazy(() => import('./contents/Widget/New'))
const Rapport = lazy(() => import('./contents/Rapport/List'))
const NewRapport = lazy(() => import('./contents/Rapport/New'))
const DetailRapport = lazy(() => import('./contents/Rapport/Detail'))
const User = lazy(() => import('./contents/User/List'))
const NewUser = lazy(() => import('./contents/User/New'))
const DetailUser = lazy(() => import('./contents/User/Detail'))
const Room = lazy(() => import('./contents/Room/List'))
const NewRoom = lazy(() => import('./contents/Room/New'))
const DetailRoom = lazy(() => import('./contents/Room/Detail'))
const OAuthSmartobject = lazy(() => import('./contents/Smartobject/OAuth'))
const Authorisation = lazy(() => import('./contents/Authorisation/List'))

import Sidebar from '../components/Sidebar'
import Context from '../utils/Context'

import Loading from '../components/Loading'

import { Grid, Card, Skeleton } from '@mui/material'

import { BrowserRouter as Router, Switch, Route, useHistory, } from "react-router-dom"

const renderLoader = () => {
    return (
        <>
            <Card variant='outlined' style={{ padding: 10, marginBottom: 8 }}>
                <Grid container >
                    <Grid item xs={12} md={12} lg={12} style={{ paddingLeft: 3, paddingRight: 3 }}>
                        <Skeleton height={35} />
                        <Skeleton height={22} />
                    </Grid>
                </Grid>
            </Card>
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
                <Router basename='/admin'>
                    <Sidebar title={title} actionType={actionType} isMobile={mainProps.isMobile} onDisconnect={() => { mainProps.onDisconnect() }} />
                    <main id='main' style={{ paddingTop: mainProps.isMobile ? 8 : '4vh', width: '100vw', paddingLeft: '5vw', paddingRight: '5vw', overflowX: 'hidden', overflowY: 'visible' }} >
                        <div style={{ marginLeft: mainProps.isMobile ? 0 : 240, height: '96vh' }}>
                            <Switch>
                                <Suspense fallback={renderLoader()}>
                                    <Route exact path="/" render={(props) => <Room setMessage={setMessage} setTitle={setTitle} setActionType={setActionType} isMobile={mainProps.isMobile} {...props} />} />
                                    <Route exact path="/smartobject" render={(props) => <Smartobject setActionType={setActionType} setMessage={setMessage} setTitle={setTitle} isMobile={mainProps.isMobile} {...props} />} />
                                    <Route exact path="/smartobject/new/:id" render={(props) => <NewSmartObject setActionType={setActionType} setMessage={setMessage} setTitle={setTitle} isMobile={mainProps.isMobile} {...props} />} />
                                    <Route exact path="/smartobject/oauth/:id" render={(props) => <OAuthSmartobject setActionType={setActionType} setMessage={setMessage} setTitle={setTitle} isMobile={mainProps.isMobile} {...props} />} />
                                    <Route exact path="/smartobject/gallery" render={(props) => <GallerySmartobject setActionType={setActionType} setMessage={setMessage} setTitle={setTitle} isMobile={mainProps.isMobile} {...props} />} />
                                    <Route exact path="/smartobject/:id" render={(props) => <DetailSmartObject setActionType={setActionType} setMessage={setMessage} setTitle={setTitle} isMobile={mainProps.isMobile} {...props} />} />
                                    <Route exact path="/module" render={(props) => <Module setActionType={setActionType} setMessage={setMessage} setTitle={setTitle} isMobile={mainProps.isMobile} {...props} />} />
                                    <Route exact path="/module/gallery" render={(props) => <GalleryModule setActionType={setActionType} setMessage={setMessage} setTitle={setTitle} isMobile={mainProps.isMobile} {...props} />} />
                                    <Route exact path="/module/:id" render={(props) => <DetailModule setActionType={setActionType} setMessage={setMessage} setTitle={setTitle} isMobile={mainProps.isMobile} {...props} />} />
                                    <Route exact path="/automation" render={(props) => <Automation setActionType={setActionType} setMessage={setMessage} setTitle={setTitle} isMobile={mainProps.isMobile} {...props} />} />
                                    <Route exact path="/automation/new" render={(props) => <NewAutomation setActionType={setActionType} setMessage={setMessage} setTitle={setTitle} isMobile={mainProps.isMobile} {...props} />} />
                                    <Route exact path="/automation/:id" render={(props) => <DetailAutomation setActionType={setActionType} setMessage={setMessage} setTitle={setTitle} isMobile={true} {...props} />} />
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
                                    <Route exact path="/room/:id" render={(props) => <DetailRoom setActionType={setActionType} setMessage={setMessage} setTitle={setTitle} isMobile={mainProps.isMobile} {...props} />} />
                                    <Route exact path="/authorisation" render={(props) => <Authorisation setActionType={setActionType} setMessage={setMessage} setTitle={setTitle} isMobile={mainProps.isMobile} {...props} />} />
                                </Suspense>
                            </Switch>
                        </div>
                    </main>
                </Router>
            )}
        </Context.Consumer>

    )
}

export default Main