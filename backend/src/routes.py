from src.models import Project, File

#helper functions

#@app.route('/GetProjects', methods=['GET'])
def get_projects():
    projects = Project.get_all()
    projects_json = []
    for project in projects:
        project_files = File.filter(Project.project_id)
        project_files_json = []
        for file in project_files:
            project_files_json.append(
                {
                    "FileId": file.file_id,
                    "Link": file.link
                }
            )
        project_fields_json = {
            "Title": project.title,
            "ShortDescription": project.short_description,
            "LongDescription": project.long_description,
            "Location": project.location,
            "ProjectOwner": project.project_owner,
            "Files": project_files_json
        }
        projects_json.append(project_fields_json)
    return projects_json


#@app.route('/UploadProjects', methods=['POST'])
def process_upload(data):
    # TODO: error handling (around saving to db)
    # TODO: check for duplication
    project = Project(
        title=data['Title'],
        short_description=data['ShortDescription'],
        long_description=data['LongDescription'],
        location=data['Location'],
        project_owner=data['ProjectOwner']
    )
    project.save()
    for link in data['FileLinks']:
        file = File(project_id=project.project_id, link=link)
        file.save()

    return data


########################################################################################################################


# project_fields = ["Title", "ShortDescription", "LongDescription", "Location", "ProjectOwner"]


# @app.route("/UploadProject", methods = ['POST'])
# def upload_project():
#     for parameter in project_fields:
#         if request.args.get(parameter) is None:
#             return "<div>failure: the parameter named \"{}\" was not provided</div>".format(parameter)
#         if not request.args[parameter].strip():
#             return "<div>failure: the parameter named \"{}\" is empty</div>".format(parameter)
#
#     new_project = Project(
#         title=request.args[project_fields[0]],
#         short_description=request.args[project_fields[1]],
#         long_description=request.args[project_fields[2]],
#         location=request.args[project_fields[3]],
#         project_owner=request.args[project_fields[4]]
#     )
#     db.session.add(new_project)
#
#     try:
#         db.session.commit()
#     except Exception as e:
#         return "<div>failure: {}</div>".format(str(e))
#
#     file_links = request.args.get("FileLinks")
#     if file_links is not None:
#         links = parse_file_links(file_links)
#         for currLink in links:
#             db.session.add(File(project_id=new_project.project_id, link=currLink))
#
#     try:
#         db.session.commit()
#     except Exception as e:
#         return "<div>failure: {}</div>".format(str(e))
#     return "<div>success: added project with id {}</div>".format(new_project.project_id)
#
#
# def parse_file_links(file_links):
#     # state = 0 means parsing link length
#     # state = 1 means parsing link text
#     state = 0
#     link_length = 0
#     link_text = []
#     parsed_links = []
#     pos = 0
#     while pos < len(file_links):
#         if state == 0:
#             link_length = link_length * 10 + (ord(file_links[pos]) - ord('0'))
#             pos = pos + 1
#             if file_links[pos].isalpha():
#                 state = 1
#         elif state == 1:
#             for i in range(link_length):
#                 link_text.append(file_links[pos + i])
#             parsed_links.append(''.join(link_text))
#             link_text = []
#             state = 0
#             pos = pos + link_length
#             link_length = 0
#     return parsed_links
