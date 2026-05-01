const char* DIRECTIONS[] = 
{
  "straight", "straight", "left", "straight", "left", "straight", "right", "straight", "straight", "right", "straight", "straight", "left", "right", "right", "straight", "straight", "straight", "straight", "left", "straight", "straight", "right", "left", "left", "right", "straight", "right", "left", "left", "straight", "right", "left", "right", "left", "right", "right", "left", "left", "straight", "left", "right", "left", "right", "left", "straight", "right", "right", "left", "right", "left", "right", "left", "right", "left", "straight", "left", "straight", "left", "right", "left", "right", "left", "right", "straight", "right", "right", "left", "right", "left", "left", "right", "straight", "left", "left", "straight", "straight", "right", "straight", "straight", "right", "right", "left", "straight", "left", "straight", "straight", "straight", "left", "right", "straight", "straight", "left", "straight", "left", "left", "right", "straight", "straight", "right", "right", "straight", "left", "left", "right", "right", "left", "straight", "straight", "left", "left", "right", "left", "straight", "straight", "right", "straight", "straight", "straight", "right", "straight", "right", "straight", "right", "left", "left", "straight", "left", "right", "left", "straight"
};
const int TOTAL_STEPS = 131;
int currentStep = 0;
bool directionMode = true;

//Example of the output provided by amazer