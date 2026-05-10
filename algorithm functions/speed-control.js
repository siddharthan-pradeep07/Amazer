let speedLevel = 0;
let dfsDelay = 160;

const speedButton = document.getElementById('speedBtn');
const dfsBtn = document.querySelector('button[onclick*="simulateBFS"]');

speedButton.style.display = 'none';

dfsBtn.addEventListener('click', function()
{
if (!speedButton.style.display || speedButton.style.display === 'none') 
   {
    speedButton.style.display = 'block';
    speedButton.style.position = 'absolute';
    speedButton.style.top = '1vw';
    speedButton.style.right = '1vw';
    speedButton.style.zIndex = '1000';
    speedButton.style.width = 'auto';
    speedButton.style.padding = '0.5vw 1vw';
    speedButton.style.fontSize = '1vw';
    speedButton.style.fontFamily = '"Instrument Serif"';
    speedButton.style.border = '2px solid #686981';
    speedButton.style.borderRadius = '1vw';
    speedButton.style.background = '#272727';
    speedButton.style.color = '#ffff00'; // Initial yellow
  }
});

speedButton.addEventListener('click', function()
{
    speedLevel = (speedLevel + 1) % 3;
    if (speedLevel === 0)
    {
        speedButton.style.color = '#ffff00'; // yellow
        dfsDelay = 160;
    }
    else if (speedLevel === 1)
    {
        speedButton.style.color = '#ff8c00'; // orange
        dfsDelay = 120;
    }
    else
    {
        speedButton.style.color = '#ff0000'; // red
        dfsDelay = 80;
    }
    speedButton.textContent = `Speed (L${speedLevel})`;
});

function getDfsDelay()
{
    return dfsDelay;
}

// This function is currently not under usage.