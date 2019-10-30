// Importing reference to all the different views
import SignInSide from './views/SignInSide/SignInSide'
import SignUp from "./views/SignUp/SignUp"
import HomePage from "./views/Home/HomePage"
import ProjectList from "./views/ProjectList/ProjectList"
import AddProposal from "./views/AddProposal/AddProposal"
import ProposalMainPage from "./views/ProposalPage/ProposalMainPage"
import ProposalPreviewPage from './views/ProposalPage/ProposalPreviewPage'

// Importing icons from Drawer
import Person from '@material-ui/icons/Person'
import PersonAdd from "@material-ui/icons/PersonAdd"
import Home from "@material-ui/icons/Home"
import List from "@material-ui/icons/List"
import Subject from "@material-ui/icons/Subject"

const loginRoutes = [
    {
        path: "/signin",
        name: "Sign In",
        icon: Person,
        component: SignInSide,
        layout: "/login"
    },
    {
        path: "/signup",
        name: "Sign Up",
        icon: PersonAdd,
        component: SignUp,
        layout: "/login"
    }
]

const proposalRoutes = [
    {
        path: "/preview",
        name: "Preview",
        component: ProposalPreviewPage,
        icon: null,
        layout: "/main/addproposal"
    },
    {
        path: "/proposalpage",
        name: "Proposal Page",
        component: ProposalMainPage,
        icon: null,
        layout: "/main/projectlist"
    }
]

const drawerRoutes = [
    {
        path: "/home",
        name: "Home Page",
        icon: Home,
        component: HomePage,
        layout: "/main"
    },
    {
        path: "/projectlist",
        name: "Project List",
        icon: List,
        component: ProjectList,
        layout: "/main"
    },
    {
        path: "/addproposal",
        name: "Add Proposal",
        icon: Subject,
        component: AddProposal,
        layout: "/main"
    },
    ...proposalRoutes
]

const routes = {
    auth: loginRoutes,
    drawer: drawerRoutes,
    proposal: proposalRoutes
}

export default routes
export {
    loginRoutes,
    drawerRoutes
}