const tracer = require('../tracer');
const meter = require('../meter');

const listCount = meter.createCounter("dao.user.list");
const getCount = meter.createCounter("dao.user.get");

class UserDao {

    async list() {
        listCount.add(1);
        return tracer.startActiveSpan(
            'users-list',
            {attributes: {"dao.lib": "memory", "dao.type": "user"}},
            (span) => {
                span.end();
                return [
                    {name: 'toto'},
                    {name: 'titi'},
                ];
            });
    }

    async getByName(name) {
        getCount.add(1);
        return tracer.startActiveSpan(
            'users-get-' + name,
            {attributes: {"dao.lib": "memory", "dao.type": "user"}},
            (span) => {
                try{
                    let result;
                    if (name === 'toto' || name === 'titi') {
                        result = {name: name};
                    } else {
                        result = null;
                    }
                    span.end();
                    return result;
                }catch (e){
                    span.recordException(e);
                }

            });


    }

}

module.exports = UserDao;