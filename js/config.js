const CONFIG = {
    OPENAI_API_KEY: '',
    
    setApiKey: function(key) {
        this.OPENAI_API_KEY = key;
        localStorage.setItem('openai_api_key', key);
    },
    
    getApiKey: function() {
        if (this.OPENAI_API_KEY) {
            return this.OPENAI_API_KEY;
        }
        
        const savedKey = localStorage.getItem('openai_api_key');
        if (savedKey) {
            this.OPENAI_API_KEY = savedKey;
            return savedKey;
        }
        
        return '';
    },
    
    clearApiKey: function() {
        this.OPENAI_API_KEY = '';
        localStorage.removeItem('openai_api_key');
    }
};

window.CONFIG = CONFIG; 