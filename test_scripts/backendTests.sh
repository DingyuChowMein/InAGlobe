cd backend/
coverage run --source src/ tests/test_backend.py
check=$?
coverage report -m
cd ..
exit $check
