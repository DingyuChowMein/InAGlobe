import React, { Component } from "react"
import ScrollMenu from "react-horizontal-scrolling-menu"

import { 
    withStyles, 
    Card, 
    CardContent,
    CardActionArea, 
    CardMedia,
    Grid,
    IconButton,
    Hidden,
} from "@material-ui/core"

import { 
    ArrowBackIos, 
    ArrowForwardIos
} from "@material-ui/icons"

import styles from "../../assets/jss/views/cardScrollViewStyle"


class CardScrollView extends Component {

    constructor(props) {
        super(props)
        this.state = {
            width: window.innerWidth
        }
        this.list = null
    }

    goToProposalPage = (index) => {
        console.log(`Card ${index} clicked!`)
    }

    updateDimensions = () => {
        this.setState({ 
            width: window.innerWidth
        })
    }
    componentDidMount() {
        window.addEventListener('resize', this.updateDimensions)
        this.list.scrollTo(0)
    }
    componentWillUnmount() {
        window.removeEventListener('resize', this.updateDimensions)
    }

    render() {
        const { classes, cardData, title } = this.props
        
        const cardsList = (
            cardData.map((card, key) => (
                <Card key={key} style={{ height: "150px", width: "200px", margin: "5px 10px" }}>
                    <CardActionArea onClick={ () => this.goToProposalPage(card.id) } style={{ height: "inherit" }}>
                        <Grid container justify="left" spacing={0} style={{ height: "inherit" }}>
                            <Grid item xs={4}>
                                <CardMedia
                                    component="img"
                                    alt={card.title}
                                    image={card.images[0]}
                                    className={classes.cardMedia}
                                />
                            </Grid>
                            <Grid item xs={8}>
                                <CardContent>
                                    <h5>{card.title}</h5>
                                </CardContent>
                            </Grid>
                        </Grid>
                    </CardActionArea>
                </Card>
            ))
        )

        const arrowLeft = (
            <IconButton aria-label="scroll-left">
                <ArrowBackIos fontSize="small"/>
            </IconButton>
        )

        const arrowRight = (
            <IconButton aria-label="scroll-right">
                <ArrowForwardIos fontSize="small"/>
            </IconButton>
        )

        const scrollMenu = (
            <ScrollMenu 
                ref={element => (this.list = element)}
                data={cardsList}
                arrowLeft={arrowLeft}
                arrowRight={arrowRight}
                hideArrows={true}
                hideSingleArrow={true}
                alignOnResize={true}
                scrollToSelected={true}
                transition={0.6}
                innerWrapperStyle={{ marginLeft: "0", marginRight: "0" }}
            />
        )

        return (
            <div>
                <h3 style={{ marginTop: "0", marginBottom: "10px" }}>{title}</h3>
                <Hidden xsDown implementation="css">
                    <div style={{ width: `calc(${this.state.width}px - 320px)` }}>
                        {scrollMenu}
                    </div>
                </Hidden>
                <Hidden smUp implementation="css">
                    <div style={{ width: `calc(${this.state.width}px - 30px)` }}>
                        {scrollMenu}
                    </div>
                </Hidden>
            </div>
        )
    }
}

export default withStyles(styles)(CardScrollView)