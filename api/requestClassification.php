<!DOCTYPE html>
<html>
    <head>
        <meta charset="utf-8">
    </head>
    <body>
        <table>
            <?php
                include __DIR__.'/lookupFDSFeedback.php';
                $health_departments = file_get_contents(__DIR__.'/health_departments.json');
                $health_departments = json_decode($health_departments, true);

                foreach ($health_departments["data"] as $department){
                    foreach ($department["fds_requests"] as $type => $requests){
                        foreach ($requests as $request){
                            $ignore = false; 

                            if (isset($fds_feedback[$request["id"]])) $ignore = true; 
                            if ($request["status"] == "awaiting_response") $ignore = true;

                            if (!$ignore){
                                echo '<tr>';
                                echo '<td valign="top">'.$type.'</td>';
                                echo '<td valign="top"><a href="https://fragdenstaat.de/a/'.$request["id"].'" target="_blank">'.$request["id"].'</a></td>';
                                echo '<td valign="top">'.$request["status"].'</td>';
                                echo '<td valign="top">'.$request["resolution"].'</td>';
                                echo '<td valign="top">'.$request["summary"].'</td>';
                                echo '<td>';
                                foreach ($request["messages"] as $message){
                                    if (!$message["is_response"]) continue;
                                    echo date("Y-m-d", strtotime($message["timestamp"]))."<pre>".$message["content"].'</pre><hr>';
                                }
                                echo 'https://fragdenstaat.de/a/'.$request["id"].' / '.$request["public_body"]["name"];
                                echo '</td>';
                                echo '</tr>';
                            }
                        }
                    }
                }
            ?>
        </table>
    </body>
</html>