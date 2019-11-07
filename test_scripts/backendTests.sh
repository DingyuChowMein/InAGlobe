cd backend/
coverage run --source src/ -m pytest
check=$?
coverage report
cd ..
exit $check
