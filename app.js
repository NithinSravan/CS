var start;
var restart;
var i;
var j;
var index;
var count;
var pos = [];
var body;
var myVar;
var end = 0;
var diff;
var conveyor;
var size;
var gamecount = 0;
var s = 0;
var ms = 0;
// best[3][5] for storing best scores in three modes
var best = new Array(3);
for (let i = 0; i < 3; i++)
{
	best[i] = new Array();
}
var sound = new Audio("Repulsor.mp3");
var audio = new Audio("button.wav");
var bs = 0;
var bms = 0;
var randomnos = [];
var modeSelect;
var box = document.getElementById('container');
var toptext = document.getElementById('toptext');
var newgame = document.getElementById('newgame');
var besttime = document.getElementById('best');
var sec = document.getElementById('sec');
var msec = document.getElementById('msec');
var btime = document.getElementsByClassName('btime');
var gridblock = document.getElementsByClassName('blocks');
var number = document.getElementsByClassName('numbers');

//setup
var setup = function ()
{
	i = 3;
	j = 1;
	gamecount = 0;
	randomnos = [];
	sec.innerHTML = "0";
	msec.innerHTML = "000";
	btime = document.getElementsByClassName('btime');
	toptext.innerHTML = "Click Away!!";
	box.style.backgroundColor = "transparent";
	box.innerHTML = "";
	box.style.border = "10px solid #fff";
	const myH1 = document.createElement('h1');
	box.appendChild(myH1);
	myH1.setAttribute("id", "countdown");
	start = document.getElementById('countdown');
	start.innerHTML = "Click To Start";
	box.addEventListener('click', begin);
};
//displays best score by creating and appending a new h3 element. h3 is created and appended using bestrec()
var display = function (index)
{

	best[index] = JSON.parse(localStorage.getItem(`arrbest${index}`));
	best[index].sort();
	size = best[index].length;
	for (let i = 0; i < size; i++)
	{
		bs = Math.floor(best[index][i] / 1000);
		bms = best[index][i] - (Math.floor(best[index][i] / 1000) * 1000);
		if (Math.floor(bms / 10) === 0)
		{
			btime[i].innerHTML = bs + '.00' + bms + ' s';
		}
		else if (Math.floor(bms / 100) === 0)
		{
			btime[i].innerHTML = bs + '.0' + bms + ' s';
		}
		else
			btime[i].innerHTML = bs + '.' + bms + ' s';
	}
};
//separate display function to display scores of a particular mode when in that mode.
var disp = function (index)
{
	best[index] = JSON.parse(localStorage.getItem(`arrbest${index}`));
	for (let i = 0; i < best[index].length; i++)
	{
		bestrec();
	}
	display(index);
};
//used to change the color when clicked depending on the index
var colorPicker = function (i)
{

	gridblock[i].style.backgroundColor = `rgb(${255-(j*5)},0,0)`;

};
//adds best scores to the array in local storage
var bestScore = function (index)
{
	best[index].push(diff);
	localStorage.setItem(`arrbest${index}`, JSON.stringify(best[index]));
	best[index] = JSON.parse(localStorage.getItem(`arrbest${index}`));
	size = best[index].length;
	best[index].sort();
	localStorage.setItem(`arrbest${index}`, JSON.stringify(best[index]));
	if (size > 5)
	{
		best[index].pop();
		localStorage.setItem(`arrbest${index}`, JSON.stringify(best[index]));
		disp(index);
	}
	else
		disp(index);

};
//timer function
var timer = function ()
{
	s = 0;
	ms = 0;
	var initial = Date.now();
	var current;
	var mseconds = setInterval(function ()
	{
		if (!end)
		{
			current = Date.now();
			diff = current - initial;
			s = Math.floor(diff / 1000);
			ms = diff - (Math.floor(diff / 1000) * 1000);
			sec.innerHTML = s;
			if (Math.floor(ms / 10) === 0)
			{
				msec.innerHTML = '00' + ms;
			}
			else if (Math.floor(ms / 100) === 0)
			{
				msec.innerHTML = '0' + ms;
			}
			else
				msec.innerHTML = ms;
		}
		else
		{
			clearInterval(mseconds);
		}

	}, 1);

}
//random number generator
var random = function (number)
{
	return Math.floor(Math.random() * number) + 1;
};
//assign random numbers to array
var assign = function ()
{
	var l = 1;
	randomnos[0] = random(20);
	var flag = 0;
	for (let i = 0;; i++)
	{
		var randomnumber = random(20);
		for (let j = 0; j < randomnos.length; j++)
		{
			if (randomnumber === randomnos[j])
			{
				flag = 1;
			}
		}
		if (randomnos.length === 23)
			flag = 0;
		if (flag === 0)
		{
			if ((l + 1) % 6 === 0)
				randomnos.push(0);
			else
				randomnos.push(randomnumber);
			if (randomnos.length === 24)
				break;
			l++;
		}
		else
		{
			flag = 0;
		}
	}
};
// this function creates modes choices div and adds hover features and calls disp() to display best scores of the current mode
var modes = function ()
{
	sec.innerHTML = "0";
	msec.innerHTML = "000";
	const myDiv = document.createElement('div');
	box.appendChild(myDiv);
	myDiv.setAttribute('id', 'gamemodes');
	var modeBox = document.getElementById('gamemodes');
	//creates mode divs
	for (let i = 0; i < 3; i++)
	{
		const Div = document.createElement('div');
		modeBox.appendChild(Div);
		Div.classList.add("mode");
	}
	modeSelect = document.getElementsByClassName('mode');
	//creates h4 for text inside mode
	for (let i = 0; i < 3; i++)
	{
		const modetxt = document.createElement('h4');
		modeSelect[i].appendChild(modetxt);
		modetxt.classList.add('modetext');
	}
	body = document.querySelector('body');
	var modetext = document.getElementsByClassName('modetext');
	//this loop handles all mouse events like hovering and clicking
	for (let i = 0; i < 3; i++)
	{
		modeSelect[i].addEventListener('mouseover', function ()
		{
			if (i === 0)
			{
				toptext.innerHTML = "Click numbers from 1-40";
				body.style.backgroundColor = "#77e83f";
				modetext[i].style.color = "#77e83f";
				modeSelect[i].style.backgroundColor = "#fff";
			}
			if (i === 1)
			{
				toptext.innerHTML = "Click numbers from 1-60";
				body.style.backgroundColor = "#ffa02b";
				modetext[i].style.color = "#ffa02b";
				modeSelect[i].style.backgroundColor = "#fff";
			}

			if (i === 2)
			{
				toptext.innerHTML = "Click numbers from 1-80";
				body.style.backgroundColor = "#ff2f2b";
				modetext[i].style.color = "#ff2f2b";
				modeSelect[i].style.backgroundColor = "#fff";
			}

		});
		modeSelect[i].addEventListener('mouseout', function ()
		{
			body.style.backgroundColor = "#343633";
			toptext.innerHTML = "Choose Difficulty:";
			if (i === 0)
			{
				modetext[i].style.color = "#fff";
				modeSelect[i].style.backgroundColor = "#77e83f";
			}
			if (i === 1)
			{
				modetext[i].style.color = "#fff";
				modeSelect[i].style.backgroundColor = "#ffa02b";
			}

			if (i === 2)
			{
				modetext[i].style.color = "#fff";
				modeSelect[i].style.backgroundColor = "#ff2f2b";
			}

		});
		modeSelect[i].addEventListener('click', function (e)
		{
			count = i * 20;
			if (i === 0)
			{
				body.style.backgroundColor = "#77e83f";
				index = i;
				if (localStorage.getItem(`arrbest${i}`) === null)
					btime[0].innerHTML = "0.000 s";
				else
					disp(i);
			}
			if (i === 1)
			{
				body.style.backgroundColor = "#ffa02b";
				index = i;
				if (localStorage.getItem(`arrbest${i}`) === null)
					btime[0].innerHTML = "0.000 s";
				else
					disp(i);
			}
			if (i === 2)
			{
				body.style.backgroundColor = "#ff2f2b";
				index = i;
				if (localStorage.getItem(`arrbest${i}`) === null)
					btime[0].innerHTML = "0.000 s";
				else
					disp(i);
			}
			e.stopPropagation();
			setup();
		});
	}
	for (let i = 0; i < 3; i++)
	{
		if (i === 0)
		{
			modetext[i].innerHTML = "Easy";
			modeSelect[i].style.backgroundColor = "#77e83f";
		}
		if (i === 1)
		{
			modetext[i].innerHTML = "Medium";
			modeSelect[i].style.backgroundColor = "#ffa02b";
		}

		if (i === 2)
		{
			modetext[i].innerHTML = "Hard";
			modeSelect[i].style.backgroundColor = "#ff2f2b";
		}
	}
};

/*

--------------------------FUNCTIONS USED TO CREATE ELEMENTS--------------------------

*/

//generated playing blocks with numbers on it
var createDiv = function ()
{

	for (let i = 0; i < 4; i++)
	{
		const gridRow = document.createElement('div');
		box.appendChild(gridRow);
		gridRow.classList.add("row");
		for (let j = 0; j < 6; j++)
		{
			const myDiv = document.createElement('div');
			gridRow.appendChild(myDiv);
			myDiv.classList.add("blocks");
			const placer = document.createElement('div');
			myDiv.appendChild(placer);
			placer.classList.add("pos");
			const divNumber = document.createElement('strong');
			divNumber.classList.add("numbers");
			myDiv.appendChild(divNumber);
			pos[j + (i * 6)] = 20 * j;
			if (i % 2 === 0)
				myDiv.style.left = `${pos[j+(i*6)]}%`;
			else
				myDiv.style.right = `${100-(pos[j+(i*6)])}%`;

		}
	}
	console.log(gridblock.length);
	for (let i = 0; i < 24; i++)
	{
		if ((i + 1) % 6 !== 0)
		{
			number[i].innerHTML = randomnos[i];
		}
		else
		{
			number[i].innerHTML = "";
		}
	}
};
//best time record
var bestrec = function ()
{
	const bestsecs = document.createElement('h3');
	besttime.appendChild(bestsecs);
	bestsecs.classList.add("btime");
};

/*

------------------------------------------X---------------------------------------------

*/

//game logic: what happens when a block is clicked
var game = function ()
{
	for (let i = 0; i < gridblock.length; i++)
	{

		gridblock[i].addEventListener('click', function (e)
		{
			e.stopPropagation();

			if (parseInt(number[i].innerHTML) === j && j <= 20 + count)
			{
				if (pos[i] > -10 && pos[i] < 90)
				{
					gridblock[i].style.backgroundColor = "red";
					audio.play();
					colorPicker(i);
					var changenum = 20 + j;
					number[i].innerHTML = changenum;
					j++;
				}

			}
			if (parseInt(number[i].innerHTML) === j && j > 20 + count)
			{
				if (pos[i] > -10 && pos[i] < 90)
				{
					number[i].innerHTML = "";
					audio.play();
					gridblock[i].style.backgroundImage = "none";
					gridblock[i].style.backgroundColor = "#000000";
					j++;
				}
			}
			if (j > 40 + count)
			{
				end = 1;
				clearInterval(conveyor);
				//these while loops are used to remove classes
				while (gridblock[0])
				{
					gridblock[0].classList.remove('blocks');
				}
				while (number[0])
				{
					number[0].classList.remove('numbers');
				}
				box.style.backgroundColor = "transparent";
				restart = document.createElement('h1');
				box.appendChild(restart);
				restart.setAttribute("id", "res");
				restart.innerHTML = 'Your time is: ' + sec.innerHTML + '.' + msec.innerHTML + 's' + '<br>' + ' Restart';

				console.log(index);
				bestScore(index);
				box.addEventListener("click", playagain);
			}
		});
	}


};
//this functions updates the position of boxes with respect to the left and right edges of the container
var move = function ()
{

	for (let i = 0; i < 24; i++)
	{
		if ((i >= 0 && i <= 5) || ((i >= 12 && i <= 17)))
		{

			if (pos[i] >= -10 && pos[i] <= 0)
			{
				var k = i % 6;
				if (k - 1 < 0)
				{
					number[i + 5].innerHTML = number[i].innerHTML;
					gridblock[i + 5].style.backgroundColor = `${gridblock[i].style.backgroundColor}`;

				}

				else
				{
					number[i - 1].innerHTML = number[i].innerHTML;
					gridblock[i - 1].style.backgroundColor = `${gridblock[i].style.backgroundColor}`;
				}

			}

			if (pos[i] === (-20))
			{
				pos[i] = 100;
				gridblock[i].style.transform = "translateX(pos[i]%)";
				pos[i]--;
			}
			else
			{
				pos[i]--;
				gridblock[i].style.left = `${pos[i]}%`;

			}
		}
		else
		{

			if (pos[i] >= -10 && pos[i] <= 0)
			{
				var k = i % 6;
				if (k - 1 < 0)
				{
					number[i + 5].innerHTML = number[i].innerHTML;
					gridblock[i + 5].style.backgroundColor = `${gridblock[i].style.backgroundColor}`;

				}

				else
				{
					number[i - 1].innerHTML = number[i].innerHTML;
					gridblock[i - 1].style.backgroundColor = `${gridblock[i].style.backgroundColor}`;
				}

			}

			if (pos[i] === (-20))
			{
				pos[i] = 100;
				gridblock[i].style.transform = "translateX(pos[i]%)";
				pos[i]--;
			}
			else
			{
				pos[i]--;
				gridblock[i].style.right = `${pos[i]}%`;

			}
		}
	}
};

/*

------------------------------Game Menu Functionalities and Triggers------------------------------

*/

//triggers the actual game
var run = function ()
{
	timer();
	assign();
	createDiv();
	conveyor = setInterval(move, 40);
	game();
};
//playgain used for restart
var playagain = function ()
{
	restart.remove();
	box.removeEventListener('click', playagain);
	setup();
};
//the actual game begins after user clicks and this function is fired
var begin = function ()
{
	sound.play();
	end = 0;

	box.removeEventListener('click', begin);
	if (i === 3)
	{
		myVar = setInterval(function ()
		{
			start.style.fontSize = "200px"
			start.style.color = "#fff";
			start.innerHTML = i;
			i--;
			if (i < 0)
			{
				clearInterval(myVar);
				start.remove();
				box.style.backgroundColor = "#fff";
				run();
			}
		}, 1000);

	}
};
/*

---------------------------------------------X----------------------------------------------

*/

//game begin from this funtion call
modes();

//fires only if new game is clicked
newgame.addEventListener('click', function ()
{
	end = 1;
	box.innerHTML = "";
	clearInterval(conveyor);
	if (!(btime[0].innerHTML === "0.000 s"))
	{   
		var len=btime.length;
		for (let j = len - 1; j > 0; j--)
		{
		   btime[j].parentNode.removeChild(btime[j]);
		};
	}
	clearInterval(myVar);
	box.removeEventListener('click', playagain);
	box.removeEventListener('click', begin);
	btime[0].innerHTML = "0.000 s";
	body.style.backgroundColor = "rgb(52, 54, 51)";
	box.style.backgroundColor = "transparent";
	box.style.border = "none";
	modes();
});