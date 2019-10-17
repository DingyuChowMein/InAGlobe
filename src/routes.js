// @material-ui/icons
import List from "@material-ui/icons/List"
import Subject from "@material-ui/icons/Subject"

// core components/views for Home layout
import ProjectList from "./views/ProjectList/ProjectList.js"
import AddProposal from "./views/AddProposal/AddProposal.js"

const routes = [
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

export default routes