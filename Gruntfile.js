module.exports = function(grunt) {

     grunt.initConfig({
        
        pkg: grunt.file.readJSON('package.json'),

       /* ec2: grunt.file.readJSON('aws/ec2.json'),*/

        uglify: {
            options: {
                banner: '/*! <%= pkg.name %> <%= grunt.template.today("yyyy-mm-dd") %> */\n'
            },
            build: {
                src: 'src/<%= pkg.name %>.js',
                dest: 'build/<%= pkg.name %>.min.js'
            }
        },
      
        jshint: {
            files: ['Gruntfile.js', 'client/build/minSscripts/start.js', 'test/**/*.js'],
            options: {
                globals: {
                    jQuery: true
                }
            }
        },

        watch: {
            files: ['<%= jshint.files %>'],
            tasks: ['jshint']
        },

        rsync: {
            options: {
                args: ['-avz', '--verbose', '--delete'],
                exclude: [".git*","*.scss","node_modules","cache","logs"],
                recursive: true
            },
            dist: {
                options: {
                    src: "./",
                    dest: "../dist"
                }
            },
            stage: {
                options: {
                    src: "../dist/",
                    dest: "/var/www/site",
                    host: "user@staging-host",
                    delete: true // Careful this option could cause data loss, read the docs!
                }
            },
            prod: {
                options: {
                    src: "/home/altanai/webrtcWSwksppace/villagexpert/villageexperts_webrtc/",
                    dest: "/home/ubuntu/villageexperts_webrtc/",
                    host: "ubuntu@54.193.124.35",
                    delete: true, 
                    ssh:true,
                    privateKey : '/home/altanai/webrtcWSwksppace/villagexpert/farook/webrtckeypair.pem'
                }
            }
        },
        
         git_deploy: {
            your_target: {
                options: {
                    url: '<%= pkg.repository.url %>'
                },
                src: '/home/altanai/webrtcWSwksppace/villagexpert/villageexperts_webrtc/'
            }
        }

    });

    // Load the plugin that provides the "uglify" task.
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-git-deploy');
    grunt.loadNpmTasks('grunt-ec2');
    grunt.loadNpmTasks("grunt-rsync");

    grunt.registerTask('deploy', ['rsync:prod']);
    /*grunt.registerTask('deploy', ['git_deploy','rsync:prod']);*/
};