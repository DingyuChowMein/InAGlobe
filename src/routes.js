// @material-ui/icons
import Home from "@material-ui/icons/Home"
import List from "@material-ui/icons/List"
import Subject from "@material-ui/icons/Subject"
// core components/views for Home layout
import DashboardPage from "views/Dashboard/Dashboard.js"
import ProjectList from "views/ProjectList/ProjectList.js"
import AddProposal from "views/AddProposal/AddProposal.js"

const dashboardRoutes = [
    {
      path: "/home",
      name: "Home",
      icon: Home,
      component: DashboardPage,
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
    }
]

export default dashboardRoutes