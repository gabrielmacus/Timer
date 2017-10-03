app.controller('timerController', function($rootScope,$interval) {
    $rootScope.containerStyle={};
    $rootScope.timer= { elapsed:{minutes:"00",seconds:"00"}};
    $rootScope.setBackgroundState=function (state) {

        switch (state)
        {
            case 1:

                $rootScope.containerStyle.animation='none';
                $rootScope.containerStyle.backgroundColor='#212121';
                $rootScope.containerStyle.color='white';
                break;
            case 2:
                $rootScope.containerStyle.animation='none';
                $rootScope.containerStyle.backgroundColor= '#FFEB3B';
                $rootScope.containerStyle.color='black';
                break;
            case 3:
                $rootScope.containerStyle.color='black';
                $rootScope.containerStyle.animation='intermitent 0.5s linear 0s infinite';

                break;
        }
    }
    $rootScope.getTime=function(time)
    {

        var minutes = (Math.floor(time / 60)).toFixed(0);

        var seconds = ( time - minutes * 60).toFixed(0);

        return [minutes,seconds];
    }
    $rootScope.startTimer=function () {

        if($rootScope.timer.interval)
        {
            $interval.cancel($rootScope.timer.interval);
        }
        var backColor="white";

        var elapsed=0;

        var elapsedPercent =0;

        var interval=1000;

        var startTime = new Date();

        $rootScope.setBackgroundState(1);

        $rootScope.timer.interval= $interval(function () {

            var totalSeconds =  ($rootScope.timer.minutes*60)+$rootScope.timer.seconds;

            //  elapsed +=interval;

            var now = new Date();
            elapsed =  Math.abs(now - startTime);


            var time = $rootScope.getTime((elapsed/1000));

            elapsedPercent =Math.ceil( ((elapsed/1000)*100) / totalSeconds);

            //elapsedPercent = (elapsedPercent>=99)?100 : elapsedPercent;


            if(elapsedPercent >= 100)
            {
                $rootScope.setBackgroundState(3);
            }
            else
            {
                $rootScope.setBackgroundState(1);

                if(totalSeconds-((elapsed/1000))<=60)
                {
                    $rootScope.setBackgroundState(2);
                }

            }


            $rootScope.timer.elapsed.minutes = ("0"+time[0]).slice(-2);

            $rootScope.timer.elapsed.seconds = ("0"+time[1]).slice(-2);

            /*
             if(elapsedPercent >= 100)
             {
             $interval.cancel($scope.timer.interval);
             }*/

        },interval);



    }

    $rootScope.stopTimer=function () {

        if($rootScope.timer.interval)
        {

            $interval.cancel($rootScope.timer.interval);
        }
        $rootScope.containerStyle={};
        $rootScope.timer= { elapsed:{minutes:"00",seconds:"00"}};
    }
    $rootScope.add=function (prop,max) {

        if(!$rootScope.timer[prop])
        {
            $rootScope.timer[prop] =0 ;
        }

        if($rootScope.timer[prop]<max)
        {
            $rootScope.timer[prop]=$rootScope.timer[prop]+1;
        }
        else
        {
            $rootScope.timer[prop]=0;
        }



    }
    $rootScope.substract=function (prop,max) {

        if(!$rootScope.timer[prop])
        {
            $rootScope.timer[prop] =0 ;
        }
        if($rootScope.timer[prop]>0)
        {
            $rootScope.timer[prop]=$rootScope.timer[prop]-1;
        }
        else
        {
            $rootScope.timer[prop]=max;
        }

    }

    var source = new EventSource("app/sse.php");
    source.onmessage = function(event) {
        console.log(event);
    };
});