cd backend/
coverage run --source ./ tests/test_backend.py
check=$?
coverage report -m
cd ..
exit $check
