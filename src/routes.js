// Importing reference to all the different views
import SignInSide from './views/SignInSide/SignInSide'
import SignUp from "./views/SignUp/SignUp"
import HomePage from "./views/Home/HomePage"
import ProjectList from "./views/ProjectList/ProjectList"
import AddProposal from "./views/AddProposal/AddProposal"
import ProposalPage from "./views/ProposalPage/ProposalPage"

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
        path: "/addproject",
        name: "Add Proposal",
        icon: Subject,
        component: AddProposal,
        layout: "/main"
    },
    {
        path: "/proposalpage",
        name: "Proposal Page",
        icon: null,
        component: ProposalPage,
        layout: "/main/projectlist"
    }
]

const routes = {
    auth: loginRoutes,
    drawer: drawerRoutes
}

export default routes
export {
    loginRoutes,
    drawerRoutes
}