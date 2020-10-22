# Browsers

This is a Django Repository to create a website for interactive realtime pose detection

**Install [Python](https://www.python.org/downloads/)**

**Install Django** ```pip install Django```


## To run the website locally

```python manage.py runserver```


# Posenet

This is a main Django app used for realtime pose detection

### templates

HTML view pages stored here

### static/js

-- Javascripts for browser rendering

-- TensorFlow.js and PoseNet included using standalone es5 bundle

```HTML
<script src="https://cdn.jsdelivr.net/npm/@tensorflow/tfjs"></script>
<script src="https://cdn.jsdelivr.net/npm/@tensorflow-models/posenet"></script>
```

-- demo_util.js for all the Keypoint, Skeleton drawing utilities

