function error(e) {
    console.log(e);
    alert("Error");
}
app.controller('timerController', function($rootScope,$interval,$websocket,$http) {


    var conn =$websocket(wsUrl);

    conn.onOpen(function(e) {
        console.log("Connection established at " + new Date());

        $rootScope.circleStyle={};
        $rootScope.containerStyle={};
        $rootScope.timer= { set:{},elapsed:{minutes:"00",seconds:"00"}};

        scope = $rootScope;
        $rootScope.setCircleProgress=function (progress) {

            //https://codepen.io/HugoGiraudel/pen/BHEwo

            progress = (progress > 100)?100:progress;

            var completeCircle = 360;

            var percentComplete = completeCircle * (progress/100);

            $rootScope.circleStyle.spinner={transform:'rotate('+percentComplete+'deg)'};

            if(progress <= 50 )
            {

                $rootScope.circleStyle.filler = {opacity:0};

                $rootScope.circleStyle.mask = {opacity:1};

            }
            else
            {

                $rootScope.circleStyle.filler = {opacity:1};

                $rootScope.circleStyle.mask = {opacity:0};
            }

        }

        $rootScope.requestSync =function () {
            $rootScope.sendMsg({type:'sync-request'});
        }
        $rootScope.setBackgroundState=function (state) {

            switch (state)
            {
                case 1:

                    $rootScope.containerStyle.animation='none';
                    $rootScope.containerStyle.backgroundColor='black';
                    $rootScope.containerStyle.color='white';
                    break;
                case 2:
                    $rootScope.containerStyle.animation='none';
                    $rootScope.containerStyle.backgroundColor= '#FFEB3B';
                    $rootScope.containerStyle.color='black';
                    break;
                case 3:
                    $rootScope.containerStyle.color='black';
                    $rootScope.containerStyle.animation='none';//'intermitent 0.5s linear 0s infinite';
                    $rootScope.containerStyle.backgroundColor= '#D32F2F';

                    break;
            }
        }
        $rootScope.getTime=function(time)
        {


            var minutes = Math.floor((time % 3600) / 60).toFixed(0);

            var seconds = (time % 60).toFixed(0);

            if(seconds > 59)
            {
                minutes++;
                seconds=0;
            }

            /*
            var minutes = (Math.floor(time / 60)).toFixed(0);

            var seconds = ( time - minutes * 60).toFixed(0);
            */

            console.log(minutes);
            console.log(seconds);
            return [minutes,seconds];
        }
        $rootScope.sendMsg=function (msg) {
            conn.send(JSON.stringify(msg));
        }

        var changeTimer=function () {
            if($rootScope.timer.interval)
            {

                $rootScope.sendMsg({type:'change',timer:$rootScope.timer});
            }
        };
        document.querySelector('.minutes').oninput=changeTimer;
        document.querySelector('.seconds').oninput=changeTimer;



        $rootScope.startTimer=function (remote) {

            if($rootScope.timer.interval)
            {
                $interval.cancel($rootScope.timer.interval);
            }

            var elapsed=0;

            var elapsedPercent =0;

            var interval=1000;

            $http.get('time.php').then(function(response){

                $rootScope.timer.startTime  = ($rootScope.timer.startTime) ?new Date($rootScope.timer.startTime):new Date( response.data.time*1000) ;


                $rootScope.setBackgroundState(1);


                if(remote)
                {
                    $rootScope.sendMsg({type:'start',timer:angular.copy($rootScope.timer)});
                }



                $rootScope.timer.interval= $interval(function () {


                    $http.get('time.php').then(function(response) {

                        var totalSeconds =  ($rootScope.timer.set.minutes*60)+$rootScope.timer.set.seconds;
                        var now = new Date(response.data.time * 1000 );
                        elapsed =  Math.abs(now - $rootScope.timer.startTime);
                        var time = $rootScope.getTime((elapsed/1000));
                        elapsedPercent =Math.ceil( ((elapsed/1000)*100) / totalSeconds);

                        $rootScope.setCircleProgress(elapsedPercent);


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

                    });


                },interval);



            },error);



        }
        conn.onMessage(
            function(e) {


                var data = JSON.parse(e.data);
                if(data.timer)
                {
                    delete data.timer.interval;
                }
                switch (data.type) {
                    case 'start':

                        if ($rootScope.timer.interval) {
                            $interval.cancel($rootScope.timer.interval);
                        }
                        $rootScope.timer = data.timer;

                        $rootScope.startTimer();

                        break;
                    case 'stop':

                        $rootScope.stopTimer();

                        break;
                    case 'change':

                        var hasInterval =false;
                        if($rootScope.timer.interval)
                        {
                            var interval = $rootScope.timer.interval;
                            hasInterval =true;
                        }


                        if(data.timer.startTime)
                        {
                            data.timer.startTime = new Date(data.timer.startTime);
                        }

                        $rootScope.timer = data.timer;


                        if(!hasInterval)
                        {

                            $rootScope.startTimer();
                        }
                        else
                        {
                            $rootScope.timer.interval=  interval;
                        }

                        break;
                    case 'sync-request':

                        changeTimer();

                        break;
                }
            }
        );

        $rootScope.stopTimer=function (remote) {


            if(remote)
            {
                $rootScope.sendMsg({type:'stop'});
            }

            if($rootScope.timer.interval)
            {

                $interval.cancel($rootScope.timer.interval);
            }
            $rootScope.setCircleProgress(0);
            $rootScope.containerStyle={};
            $rootScope.timer= { set:{},elapsed:{minutes:"00",seconds:"00"}};
        }
        $rootScope.add=function (prop,max) {

            if(!$rootScope.timer.set[prop])
            {
                $rootScope.timer.set[prop] =0 ;
            }

            if($rootScope.timer.set[prop]<max)
            {
                $rootScope.timer.set[prop]=$rootScope.timer.set[prop]+1;
            }
            else
            {
                $rootScope.timer.set[prop]=0;
            }

            changeTimer();

        }
        $rootScope.substract=function (prop,max) {

            if(!$rootScope.timer.set[prop])
            {
                $rootScope.timer.set[prop] =0 ;
            }
            if($rootScope.timer.set[prop]>0)
            {
                $rootScope.timer.set[prop]=$rootScope.timer.set[prop]-1;
            }
            else
            {
                $rootScope.timer.set[prop]=max;
            }

            changeTimer();


        }


        $rootScope.requestSync();
        $rootScope.$apply();


    });







});
